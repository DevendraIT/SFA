import { AppError } from '../../../shared/response.js';
// We import the leadsService from the core lead-management module
import { leadsService } from '../../lead-management/routes/lead.routes.js'; 

export class LeadEngineService {
  constructor(
    prospectRepo,
    importJobRepo,
    importDomainService,
    cleaningDomainService
  ) {
    this.prospectRepo = prospectRepo;
    this.importJobRepo = importJobRepo;
    this.importDomainService = importDomainService;
    this.cleaningDomainService = cleaningDomainService;
  }

  /**
   * Orchestrates the import of a physical file
   */
  async processImport(organizationId, userId, filePath, originalName) {
    let importJobId = null;
    try {
      // 1. Create Job immediately so user can track it
      const job = await this.importJobRepo.create({
        organizationId,
        uploadedById: userId,
        fileName: filePath,
        originalName,
        status: 'PROCESSING'
      });
      importJobId = job.id;

      // 2. Parse file based on extension
      const isExcel = originalName.toLowerCase().endsWith('.xlsx') || originalName.toLowerCase().endsWith('.xls');
      const rawRecords = isExcel
        ? await this.importDomainService.parseExcel(filePath)
        : await this.importDomainService.parseCSV(filePath);

      const total = rawRecords.length;
      await this.importJobRepo.update(importJobId, { totalRecords: total });

      // Use cleanBatch: handles per-record validation, in-batch duplicate detection, and report generation
      const { cleaned, failed, report } = this.cleaningDomainService.cleanBatch(rawRecords);

      // Stamp org + job onto each clean record, and calculate initial demographic score
      const scoringDomain = new (await import('../scoring/ScoringDomainService.js')).ScoringDomainService();
      const cleanedRecords = cleaned.map(r => {
        const baseScore = scoringDomain.calculateDemographicScore(r);
        return { ...r, organizationId, importJobId, score: baseScore };
      });

      // Batch insert — DB will also reject cross-job email duplicates via unique constraint
      let dbInsertedCount = 0;
      if (cleanedRecords.length > 0) {
        const result = await this.prospectRepo.createMany(cleanedRecords);
        dbInsertedCount = result.count;
      }

      const dbDuplicateCount = cleanedRecords.length - dbInsertedCount;

      await this.importJobRepo.update(importJobId, {
        processedRecords: dbInsertedCount,
        failedRecords: failed.length + dbDuplicateCount,
        errorMessage: JSON.stringify({
          cleaningReport: report,
          failedSample: failed.slice(0, 100), // Store up to 100 failures for auditing
        }),
        status: 'COMPLETED',
        completedAt: new Date()
      });

      return { importJobId, status: 'PROCESSING', cleaningReport: report };
    } catch (err) {
      if (importJobId) {
        await this.importJobRepo.update(importJobId, { 
          status: 'FAILED',
          errorMessage: err.message
        });
      }
      throw err;
    }
  }

  /**
   * Orchestrates the import of API/Manual JSON array
   */
  async processApiImport(organizationId, userId, prospectsArray) {
    const job = await this.importJobRepo.create({
      organizationId,
      uploadedById: userId,
      fileName: 'API_IMPORT',
      originalName: 'API_IMPORT',
      status: 'PROCESSING',
      totalRecords: prospectsArray.length
    });

    // Use cleanBatch for consistent validation and duplicate detection
    const { cleaned, failed, report } = this.cleaningDomainService.cleanBatch(prospectsArray);

    const scoringDomain = new (await import('../scoring/ScoringDomainService.js')).ScoringDomainService();
    const cleanedRecords = cleaned.map(r => {
      const baseScore = scoringDomain.calculateDemographicScore(r);
      return { ...r, organizationId, importJobId: job.id, score: baseScore };
    });

    let dbInsertedCount = 0;
    if (cleanedRecords.length > 0) {
      const result = await this.prospectRepo.createMany(cleanedRecords);
      dbInsertedCount = result.count;
    }

    const dbDuplicateCount = cleanedRecords.length - dbInsertedCount;

    await this.importJobRepo.update(job.id, {
      processedRecords: dbInsertedCount,
      failedRecords: failed.length + dbDuplicateCount,
      errorMessage: JSON.stringify({
        cleaningReport: report,
        failedSample: failed.slice(0, 100),
      }),
      status: 'COMPLETED',
      completedAt: new Date()
    });

    return { importJobId: job.id, status: 'COMPLETED', cleaningReport: report };
  }

  /**
   * Pushes a qualified prospect to the core Lead Management module
   */
  async autoCreateLead(prospect, userId) {
    if (prospect.isConvertedToLead) return prospect.leadId;

    try {
      // Use the existing LeadService logic! Do not duplicate!
      const leadPayload = {
        firstName: prospect.firstName || 'Unknown',
        lastName: prospect.lastName || 'Unknown',
        email: prospect.email,
        phone: prospect.phone,
        company: prospect.company,
        jobTitle: prospect.jobTitle,
        industry: prospect.industry,
        companySize: prospect.companySize,
        country: prospect.country,
        state: prospect.state,
        city: prospect.city,
        source: 'CAMPAIGN',
        qualification: prospect.qualificationStatus,
        score: prospect.score,
      };

      // 1. Duplicate check is inherently handled by leadsService if they have email constraints,
      // but we can explicitly try/catch to gracefully handle Unique Constraint failures
      const newLead = await leadsService.createLead(prospect.organizationId, userId, leadPayload);

      await this.prospectRepo.update(prospect.id, {
        isConvertedToLead: true,
        leadId: newLead.id
      });

      return newLead.id;
    } catch (error) {
      // If it's a known conflict (e.g. email already exists in Lead Management)
      // mark it as converted with a pseudo-ID or the existing lead's ID if retrievable
      if (error.statusCode === 409 || error.message.includes('Unique')) {
        // We could look up the existing lead by email via leadsService if available.
        // For now, mark as DISQUALIFIED in engine to stop trying, or just log.
        console.warn(`[AutoCreateLead] Duplicate lead found for ${prospect.email}`);
      }
      throw error;
    }
  }
}
