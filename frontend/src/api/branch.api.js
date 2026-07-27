import api from "./axios";

const BASE_URL = "/organization/branches";

const branchApi = {
  getBranches(params = {}) {
    return api.get(BASE_URL, { params });
  },

  getBranch(id) {
    return api.get(`${BASE_URL}/${id}`);
  },

  createBranch(data) {
    return api.post(BASE_URL, data);
  },

  updateBranch(id, data) {
    return api.put(`${BASE_URL}/${id}`, data);
  },

  deleteBranch(id) {
    return api.delete(`${BASE_URL}/${id}`);
  },
};

export default branchApi;

