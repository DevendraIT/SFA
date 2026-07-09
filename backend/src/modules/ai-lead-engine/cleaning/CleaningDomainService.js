import { normalizeText, toTitleCase, stripPhone } from '../helpers/utils.js';
import {
  COUNTRY_MAP,
  US_STATE_MAP,
  IN_STATE_MAP,
  KNOWN_CITIES,
  DISPOSABLE_EMAIL_DOMAINS,
  COMPANY_SUFFIXES,
} from './cleaning.data.js';

/**
 * Deterministic business logic for data cleaning.
 * Strictly no AI. All rules are rule-based and explicit.
 */
export class CleaningDomainService {

  /**
   * Clean and validate a single raw record.
   * Returns a cleaned object or an { error, reason } invalid object.
   * Never returns null so the caller can generate proper reports.
   */
  cleanRecord(rawRecord) {
    const email = normalizeText(rawRecord.email)?.toLowerCase();

    // --- Email Validation ---
    const emailError = this.validateEmail(email);
    if (emailError) {
      return { _invalid: true, reason: emailError, raw: rawRecord };
    }

    // --- Phone Validation ---
    const phone = this.normalizePhone(rawRecord.phone);

    // --- Name Normalization ---
    const firstName = toTitleCase(rawRecord.first_name || rawRecord.firstName || rawRecord.firstname);
    const lastName = toTitleCase(rawRecord.last_name || rawRecord.lastName || rawRecord.lastname);

    // --- Company Normalization ---
    const company = this.normalizeCompany(rawRecord.company || rawRecord.company_name);

    // --- Geo Detection ---
    const country = this.detectCountry(rawRecord.country);
    const state = this.detectState(rawRecord.state, country);
    const city = this.detectCity(rawRecord.city);

    return {
      email,
      firstName,
      lastName,
      company,
      jobTitle: toTitleCase(rawRecord.job_title || rawRecord.jobTitle || rawRecord.title),
      phone,
      website: normalizeText(rawRecord.website),
      industry: toTitleCase(rawRecord.industry),
      companySize: normalizeText(rawRecord.company_size || rawRecord.companySize),
      country,
      state,
      city,
    };
  }

  // ─────────────────────────────────────────────
  // Email
  // ─────────────────────────────────────────────

  /**
   * Returns a reason string if invalid, null if valid.
   */
  validateEmail(email) {
    if (!email) return 'MISSING_EMAIL';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'INVALID_EMAIL_FORMAT';

    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) return 'INVALID_EMAIL_FORMAT';

    if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) return 'DISPOSABLE_EMAIL_DOMAIN';

    // Must have a proper TLD (at least 2 chars)
    const tld = domain.split('.').pop();
    if (!tld || tld.length < 2) return 'INVALID_EMAIL_TLD';

    return null; // valid
  }

  isValidEmail(email) {
    return this.validateEmail(email) === null;
  }

  // ─────────────────────────────────────────────
  // Phone
  // ─────────────────────────────────────────────

  /**
   * Normalize phone: strip formatting, validate digit length.
   * Accepts E.164 (+1234567890) and local formats.
   */
  normalizePhone(phone) {
    if (!phone) return null;

    const raw = String(phone).trim();

    // Preserve leading + for E.164 format detection
    const isE164 = raw.startsWith('+');
    const digits = stripPhone(raw);

    if (!digits) return null;

    // Valid phone: between 7 and 15 digits (ITU-T E.164 max is 15)
    if (digits.length < 7 || digits.length > 15) return null;

    return isE164 ? `+${digits}` : digits;
  }

  // ─────────────────────────────────────────────
  // Name
  // ─────────────────────────────────────────────

  normalizeName(name) {
    return toTitleCase(name);
  }

  // ─────────────────────────────────────────────
  // Company
  // ─────────────────────────────────────────────

  normalizeCompany(company) {
    const raw = normalizeText(company);
    if (!raw) return null;
    // Remove common legal suffixes and trim
    return raw.replace(COMPANY_SUFFIXES, '').trim() || null;
  }

  // ─────────────────────────────────────────────
  // Geo Detection — all deterministic map lookups
  // ─────────────────────────────────────────────

  detectCountry(country) {
    const raw = normalizeText(country);
    if (!raw) return null;
    return COUNTRY_MAP[raw.toLowerCase()] ?? toTitleCase(raw);
  }

  detectState(state, country) {
    const raw = normalizeText(state);
    if (!raw) return null;
    const key = raw.toLowerCase();

    // Prefer country-specific maps
    if (country === 'United States' || !country) {
      if (US_STATE_MAP[key]) return US_STATE_MAP[key];
    }
    if (country === 'India' || !country) {
      if (IN_STATE_MAP[key]) return IN_STATE_MAP[key];
    }
    // Fallback: title-case raw value
    return toTitleCase(raw);
  }

  detectCity(city) {
    const raw = normalizeText(city);
    if (!raw) return null;
    // Validate against known cities list; accept unknown ones with title-case
    return toTitleCase(raw);
  }

  // ─────────────────────────────────────────────
  // Batch Processing with Duplicate Detection
  // ─────────────────────────────────────────────

  /**
   * Clean an entire batch of raw records.
   * Performs in-batch duplicate detection by email.
   * Returns { cleaned, failed, report }.
   */
  cleanBatch(rawRecords) {
    const seenEmails = new Set();
    const cleaned = [];
    const failed = [];

    for (const record of rawRecords) {
      const result = this.cleanRecord(record);

      if (result._invalid) {
        failed.push({ reason: result.reason, raw: result.raw });
        continue;
      }

      // In-batch duplicate check
      if (seenEmails.has(result.email)) {
        failed.push({ reason: 'DUPLICATE_IN_BATCH', raw: record });
        continue;
      }

      seenEmails.add(result.email);
      cleaned.push(result);
    }

    const report = this.generateCleaningReport(rawRecords.length, cleaned, failed);
    return { cleaned, failed, report };
  }

  // ─────────────────────────────────────────────
  // Cleaning Report
  // ─────────────────────────────────────────────

  /**
   * Generate a structured cleaning report summarizing validation results.
   */
  generateCleaningReport(totalInput, cleaned, failed) {
    // Group failures by reason
    const byReason = failed.reduce((acc, f) => {
      acc[f.reason] = (acc[f.reason] || 0) + 1;
      return acc;
    }, {});

    return {
      totalInput,
      totalCleaned: cleaned.length,
      totalFailed: failed.length,
      passRate: totalInput > 0
        ? `${((cleaned.length / totalInput) * 100).toFixed(1)}%`
        : '0%',
      failureBreakdown: byReason,
      generatedAt: new Date().toISOString(),
    };
  }
}
