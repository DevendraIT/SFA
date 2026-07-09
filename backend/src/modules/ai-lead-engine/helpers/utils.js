import crypto from 'crypto';

/**
 * Standardize text inputs
 * @param {string} text 
 * @returns {string|null}
 */
/**
 * Trim and return null if empty.
 */
export const normalizeText = (text) => {
  if (text === null || text === undefined) return null;
  const trimmed = String(text).trim();
  return trimmed.length > 0 ? trimmed : null;
};

/**
 * Convert a string to Title Case. "john doe" → "John Doe"
 */
export const toTitleCase = (text) => {
  const raw = normalizeText(text);
  if (!raw) return null;
  return raw
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

/**
 * Strip all non-digit characters from a phone string.
 */
export const stripPhone = (phone) => {
  const raw = normalizeText(phone);
  if (!raw) return null;
  return raw.replace(/\D/g, '');
};

/**
 * Generate a safe unique hash for idempotency if needed
 */
export const generateHash = (str) => {
  return crypto.createHash('md5').update(str).digest('hex');
};

/**
 * Parse a provider message ID from webhook payload safely
 */
export const parseProviderId = (payload) => {
  // Assuming a generic payload structure
  return payload.message_id || payload.sg_message_id || null;
};
