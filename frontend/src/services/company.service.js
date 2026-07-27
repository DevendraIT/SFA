import companyApi from "../api/company.api";

const companyService = {
  async getCompanies(params = {}) {
    console.log("Request Params:", params);
    
    const res = await companyApi.getCompanies(params);
    return res.data;
  },

  async getCompany(id) {
    const res = await companyApi.getCompany(id);
    return res.data;
  },

  async createCompany(data) {
    const res = await companyApi.createCompany(data);
    return res.data;
  },

  async updateCompany(id, data) {
    const res = await companyApi.updateCompany(id, data);
    return res.data;
  },

  async deleteCompany(id) {
    const res = await companyApi.deleteCompany(id);
    return res.data;
  },
};

export default companyService;