import api from "./axios";

const BASE_URL = "/roles";

const roleApi = {
  getRoles(params = {}) {
    return api.get(BASE_URL, { params });
  },

  getRole(id) {
    return api.get(`${BASE_URL}/${id}`);
  },
};

export default roleApi;

