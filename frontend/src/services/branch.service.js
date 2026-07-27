import branchApi from "../api/branch.api";

const branchService = {
  async getBranches(params = {}) {
    const res = await branchApi.getBranches(params);
    return res.data;
  },

  async getBranch(id) {
    const res = await branchApi.getBranch(id);
    return res.data;
  },

  async createBranch(data) {
    const res = await branchApi.createBranch(data);
    return res.data;
  },

  async updateBranch(id, data) {
    const res = await branchApi.updateBranch(id, data);
    return res.data;
  },

  async deleteBranch(id) {
    const res = await branchApi.deleteBranch(id);
    return res.data;
  },
};

export default branchService;

