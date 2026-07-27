import api from "./axios";

const BASE_URL = "/organization/companies";

const companyApi = {
  /**
   * Get Companies
   */
  getCompanies(params = {}) {
    return api.get(BASE_URL, { params });
  },

  /**
   * Get Company Details
   */
  getCompany(id) {
    return api.get(`${BASE_URL}/${id}`);
  },

  /**
   * Create Company
   */
  createCompany(data) {
    return api.post(BASE_URL, data);
  },

  /**
   * Update Company
   */
  updateCompany(id, data) {
    return api.put(`${BASE_URL}/${id}`, data);
  },

  /**
   * Delete Company
   */
  deleteCompany(id) {
    return api.delete(`${BASE_URL}/${id}`);
  },
};

export default companyApi;