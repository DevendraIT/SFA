import api from "./axios";

const BASE_URL = "/users";

const userApi = {
  getUsers(params = {}) {
    return api.get(BASE_URL, { params });
  },

  getUser(id) {
    return api.get(`${BASE_URL}/${id}`);
  },

  createUser(data) {
    return api.post(BASE_URL, data);
  },

  updateUser(id, data) {
    return api.put(`${BASE_URL}/${id}`, data);
  },

  deleteUser(id) {
    return api.delete(`${BASE_URL}/${id}`);
  },

  updateUserRoles(id, roleIds) {
    return api.put(`${BASE_URL}/${id}/roles`, { roleIds });
  },

  activateUser(id) {
    return api.patch(`${BASE_URL}/${id}/activate`);
  },

  deactivateUser(id) {
    return api.patch(`${BASE_URL}/${id}/deactivate`);
  },

  getSubordinates(id) {
    return api.get(`${BASE_URL}/${id}/subordinates`);
  },

  getManagerHierarchy(id) {
    return api.get(`${BASE_URL}/${id}/hierarchy`);
  },
};

export default userApi;

