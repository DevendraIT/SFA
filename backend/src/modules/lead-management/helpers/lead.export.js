import { createWriteStream, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import logger from '../../../utils/logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Exports are written to: backend/exports/leads/
const EXPORT_DIR = join(__dirname, '..', '..', '..', 'exports', 'leads');

/**
 * Ensure export directory exists
 */
const ensureExportDir = () => {
  if (!existsSync(EXPORT_DIR)) {
    mkdirSync(EXPORT_DIR, { recursive: true });
  }
};

/**
 * Flatten a lead record into a plain row object for export
 * @param {Object} lead - Prisma lead record
 * @returns {Object} flat row
 */
const flattenLead = (lead) => ({
  id:            lead.id,
  firstName:     lead.firstName,
  lastName:      lead.lastName,
  email:         lead.email ?? '',
  phone:         lead.phone ?? '',
  company:       lead.company ?? '',
  jobTitle:      lead.jobTitle ?? '',
  website:       lead.website ?? '',
  industry:      lead.industry ?? '',
  companySize:   lead.companySize ?? '',
  source:        lead.source,
  status:        lead.status,
  priority:      lead.priority,
  qualification: lead.qualification,
  score:         lead.score,
  addressLine1:  lead.addressLine1 ?? '',
  city:          lead.city ?? '',
  state:         lead.state ?? '',
  country:       lead.country ?? '',
  postalCode:    lead.postalCode ?? '',
  tags:          (lead.tags ?? []).join(', '),
  notes:         lead.notes ?? '',
  assignedTo:    lead.assignedTo
    ? `${lead.assignedTo.firstName} ${lead.assignedTo.lastName} <${lead.assignedTo.email}>`
    : '',
  territory:     lead.territory?.name ?? '',
  createdAt:     lead.createdAt?.toISOString() ?? '',
  updatedAt:     lead.updatedAt?.toISOString() ?? '',
});

/**
 * Escape a CSV field value
 * Wraps in quotes if value contains comma, quote, or newline
 */
const escapeCsvField = (value) => {
  const str = String(value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

/**
 * Write leads to a CSV file
 * @param {Object[]} leads - Array of lead records from DB
 * @param {string} fileName - Output file name (without extension)
 * @returns {Promise<string>} Absolute file path of the generated CSV
 */
export const writeLeadsCsv = async (leads, fileName) => {
  ensureExportDir();
  const filePath = join(EXPORT_DIR, `${fileName}.csv`);

  const columns = [
    'id', 'firstName', 'lastName', 'email', 'phone',
    'company', 'jobTitle', 'website', 'industry', 'companySize',
    'source', 'status', 'priority', 'qualification', 'score',
    'addressLine1', 'city', 'state', 'country', 'postalCode',
    'tags', 'notes', 'assignedTo', 'territory',
    'createdAt', 'updatedAt',
  ];

  return new Promise((resolve, reject) => {
    const stream = createWriteStream(filePath, { encoding: 'utf-8' });

    stream.on('error', (err) => {
      logger.error('[LeadsExport] CSV write stream error:', err);
      reject(err);
    });

    stream.on('finish', () => resolve(filePath));

    // Header row
    stream.write(columns.map(escapeCsvField).join(',') + '\n');

    // Data rows
    for (const lead of leads) {
      const row = flattenLead(lead);
      stream.write(columns.map(col => escapeCsvField(row[col])).join(',') + '\n');
    }

    stream.end();
  });
};

/**
 * Write leads to an Excel (.xlsx) file
 * Uses the 'xlsx' package if available — gracefully falls back with an error
 * if the package is not installed.
 *
 * To enable Excel export, install:  npm install xlsx
 *
 * @param {Object[]} leads - Array of lead records from DB
 * @param {string} fileName - Output file name (without extension)
 * @returns {Promise<string>} Absolute file path of the generated XLSX
 */
export const writeLeadsExcel = async (leads, fileName) => {
  ensureExportDir();
  const filePath = join(EXPORT_DIR, `${fileName}.xlsx`);

  let XLSX;
  try {
    XLSX = (await import('xlsx')).default;
  } catch {
    throw new Error(
      'Excel export requires the "xlsx" package. Install it with: npm install xlsx'
    );
  }

  const rows = leads.map(flattenLead);

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook  = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');

  XLSX.writeFile(workbook, filePath);

  return filePath;
};

/**
 * Generate a unique export file name based on timestamp
 * @param {string} organizationId
 * @returns {string}
 */
export const buildExportFileName = (organizationId) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `leads_${organizationId.slice(0, 8)}_${timestamp}`;
};
