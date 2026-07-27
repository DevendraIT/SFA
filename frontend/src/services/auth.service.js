import api from "../api/axios";

class AuthService {
  async login(credentials) {
    const response = await api.post("/auth/login", credentials);

    return response.data;
  }

  async logout(refreshToken = null) {
    const response = await api.post("/auth/logout", {
      refreshToken,
    });

    return response.data;
  }

  async refreshToken() {
    const response = await api.post("/auth/refresh-token");

    return response.data;
  }

  async forgotPassword(email) {
    const response = await api.post("/auth/forgot-password", {
      email,
    });

    return response.data;
  }

  async resetPassword(data) {
    const response = await api.post("/auth/reset-password", data);

    return response.data;
  }

  async changePassword(data) {
    const response = await api.post("/auth/change-password", data);

    return response.data;
  }

  async getProfile() {
    const response = await api.get("/auth/me");

    return response.data;
  }

  async getSessions() {
    const response = await api.get("/auth/sessions");

    return response.data;
  }
}

export default new AuthService();