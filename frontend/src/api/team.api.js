import api from "./axios";

const BASE_URL = "/teams";

const teamApi = {
  getTeams(params = {}) {
    return api.get(BASE_URL, { params });
  },

  getTeam(id) {
    return api.get(`${BASE_URL}/${id}`);
  },

  createTeam(data) {
    return api.post(BASE_URL, data);
  },

  updateTeam(id, data) {
    return api.put(`${BASE_URL}/${id}`, data);
  },

  deleteTeam(id) {
    return api.delete(`${BASE_URL}/${id}`);
  },
};

export default teamApi;

