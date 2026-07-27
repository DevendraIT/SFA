import departmentApi from "../api/department.api";

const departmentService = {
  async getDepartments(params = {}) {
    const res = await departmentApi.getDepartments(params);
    return res.data;
  },

  async getDepartment(id) {
    const res = await departmentApi.getDepartment(id);
    return res.data;
  },

  async createDepartment(data) {
    const res = await departmentApi.createDepartment(data);
    return res.data;
  },

  async updateDepartment(id, data) {
    const res = await departmentApi.updateDepartment(id, data);
    return res.data;
  },

  async deleteDepartment(id) {
    const res = await departmentApi.deleteDepartment(id);
    return res.data;
  },
};

export default departmentService;

