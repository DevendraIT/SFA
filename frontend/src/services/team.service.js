import teamApi from "../api/team.api";

const teamService = {
  async getTeams(params = {}) {
    const res = await teamApi.getTeams(params);
    return res.data;
  },

  async getTeam(id) {
    const res = await teamApi.getTeam(id);
    return res.data;
  },

  async createTeam(data) {
    const res = await teamApi.createTeam(data);
    return res.data;
  },

  async updateTeam(id, data) {
    const res = await teamApi.updateTeam(id, data);
    return res.data;
  },

  async deleteTeam(id) {
    const res = await teamApi.deleteTeam(id);
    return res.data;
  },
};

export default teamService;

