import api from "./axios";

const BASE_URL = "/orders";

const salesApi = {
  listOrders(params = {}) {
    return api.get(BASE_URL, { params });
  },

  getOrder(id) {
    return api.get(`${BASE_URL}/${id}`);
  },

  createOrder(data) {
    return api.post(BASE_URL, data);
  },

  updateOrder(id, data) {
    return api.put(`${BASE_URL}/${id}`, data);
  },

  deleteOrder(id) {
    return api.delete(`${BASE_URL}/${id}`);
  },

  updateOrderStatus(id, data) {
    return api.patch(`${BASE_URL}/${id}/status`, data);
  },

  approveOrder(id) {
    return api.post(`${BASE_URL}/${id}/approve`);
  },

  rejectOrder(id) {
    return api.post(`${BASE_URL}/${id}/reject`);
  },

  cancelOrder(id) {
    return api.post(`${BASE_URL}/${id}/cancel`);
  },

  completeOrder(id) {
    return api.post(`${BASE_URL}/${id}/complete`);
  },

  assignOrder(id, data) {
    return api.post(`${BASE_URL}/${id}/assign`, data);
  },

  getOrderActivities(id) {
    return api.get(`${BASE_URL}/${id}/activities`);
  },

  addOrderNote(id, data) {
    return api.post(`${BASE_URL}/${id}/notes`, data);
  },

  getOrderStats() {
    return api.get(`${BASE_URL}/stats`);
  },

  exportOrders(params = {}) {
    return api.get(`${BASE_URL}/export`, { params });
  },
};

export default salesApi;

