/**
 * Shared Helper Functions - Enterprise Modular Monolith
 */

/**
 * Generate pagination metadata
 */
export const generatePagination = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

/**
 * Generate slug from name
 */
export const generateSlug = (name, suffix = '') => {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return suffix ? `${baseSlug}-${suffix}` : baseSlug;
};

/**
 * Sanitize object by removing null/undefined values
 */
export const sanitizeObject = (obj, removeEmpty = false) => {
  const result = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined) {
      if (removeEmpty && (value === '' || (Array.isArray(value) && value.length === 0))) {
        continue;
      }
      result[key] = value;
    }
  }
  
  return result;
};

/**
 * Parse query string filters
 */
export const parseFilters = (query, allowedFilters = []) => {
  const filters = {};
  
  allowedFilters.forEach(filter => {
    if (query[filter] !== undefined && query[filter] !== null && query[filter] !== '') {
      if (Array.isArray(query[filter])) {
        filters[filter] = query[filter];
      } else if (typeof query[filter] === 'string' && query[filter].includes(',')) {
        filters[filter] = query[filter].split(',').map(item => item.trim());
      } else {
        filters[filter] = query[filter];
      }
    }
  });
  
  return filters;
};