import api from "../services/api";

export const getDashboardData = async () => {
  try {
    const [
      organizations,
      companies,
      branches,
      territories,
      departments,
      users,
    ] = await Promise.all([
      api.get("/organization/organizations"),
      api.get("/organization/companies"),
      api.get("/organization/branches"),
      api.get("/organization/territories"),
      api.get("/organization/departments"),
      api.get("/users"),
    ]);

    return {
      organizations: organizations.data,
      companies: companies.data,
      branches: branches.data,
      territories: territories.data,
      departments: departments.data,
      users: users.data,
    };
  } catch (error) {
    console.error("Dashboard API Error:", error);
    throw error;
  }
};