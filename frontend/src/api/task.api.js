import api from "./axios";

const BASE_URL = "/field-force/tasks";

const taskApi = {
  createTask(data) {
    return api.post(BASE_URL, data);
  },

  getTasks(params = {}) {
    return api.get(BASE_URL, { params });
  },

  getTask(id) {
    return api.get(`${BASE_URL}/${id}`);
  },

  completeTask(id, data = {}) {
    return api.patch(`${BASE_URL}/${id}/complete`, data);
  },
};

export default taskApi;

