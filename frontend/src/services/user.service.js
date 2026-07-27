import userApi from "../api/user.api";

const userService = {
  async getUsers(params = {}) {
    const res = await userApi.getUsers(params);
    return res.data;
  },

  async getUser(id) {
    const res = await userApi.getUser(id);
    return res.data;
  },

  async createUser(data) {
    const res = await userApi.createUser(data);
    return res.data;
  },

  async updateUser(id, data) {
    const res = await userApi.updateUser(id, data);
    return res.data;
  },

  async deleteUser(id) {
    const res = await userApi.deleteUser(id);
    return res.data;
  },

  async updateUserRoles(id, roleIds) {
    const res = await userApi.updateUserRoles(id, roleIds);
    return res.data;
  },

  async activateUser(id) {
    const res = await userApi.activateUser(id);
    return res.data;
  },

  async deactivateUser(id) {
    const res = await userApi.deactivateUser(id);
    return res.data;
  },

  async getSubordinates(id) {
    const res = await userApi.getSubordinates(id);
    return res.data;
  },

  async getManagerHierarchy(id) {
    const res = await userApi.getManagerHierarchy(id);
    return res.data;
  },
};

export default userService;

