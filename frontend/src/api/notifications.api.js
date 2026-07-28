import api from "./axios";

const BASE_URL = "/notifications";

const notificationsApi = {
  getMyNotifications() {
    return api.get(`${BASE_URL}/me`);
  },

  markAsRead(id) {
    return api.patch(`${BASE_URL}/${id}/read`);
  },

  markAllAsRead() {
    return api.patch(`${BASE_URL}/read-all`);
  },
};

export default notificationsApi;
