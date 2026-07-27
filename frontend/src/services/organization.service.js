import * as api from "../api/organization.api";

const organizationService = {
  getCompanies: api.getCompanies,
  getCompany: api.getCompany,
  createCompany: api.createCompany,
  updateCompany: api.updateCompany,
  deleteCompany: api.deleteCompany,
};

export default organizationService;