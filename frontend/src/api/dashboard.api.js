import api from "./axios";

export const getExecutiveDashboard = () =>
  api.get("/dashboard/executive");

export const getTeamDashboard = () =>
  api.get("/dashboard/team");

export const getUserDashboard = () =>
  api.get("/dashboard/me");