import roleApi from "../api/role.api";

const roleService = {
  async getRoles(params = {}) {
    const res = await roleApi.getRoles(params);
    return res.data;
  },

  async getRole(id) {
    const res = await roleApi.getRole(id);
    return res.data;
  },
};

export default roleService;

