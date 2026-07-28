import api from "./axios";

const BASE_URL = "/auth";

const authApi = {
  login(credentials) {
    return api.post(`${BASE_URL}/login`, credentials);
  },

  getMe() {
    return api.get(`${BASE_URL}/me`);
  },

  updateProfile(data) {
    return api.put(`${BASE_URL}/me`, data);
  },

  changePassword(data) {
    return api.post(`${BASE_URL}/change-password`, data);
  },

  logout() {
    return api.post(`${BASE_URL}/logout`);
  },
};

export default authApi;
