import api from "./axios";

const BASE_URL = "/organization/departments";

const departmentApi = {
  getDepartments(params = {}) {
    return api.get(BASE_URL, { params });
  },

  getDepartment(id) {
    return api.get(`${BASE_URL}/${id}`);
  },

  createDepartment(data) {
    return api.post(BASE_URL, data);
  },

  updateDepartment(id, data) {
    return api.put(`${BASE_URL}/${id}`, data);
  },

  deleteDepartment(id) {
    return api.delete(`${BASE_URL}/${id}`);
  },
};

export default departmentApi;

