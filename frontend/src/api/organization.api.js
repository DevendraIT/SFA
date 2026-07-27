import api from "./axios";

export const getCompanies = async (params = {}) => {
  const { data } = await api.get(
    "/organization/companies",
    {
      params,
    }
  );

  return data;
};

export const getCompany = async (id) => {
  const { data } = await api.get(
    `/organization/companies/${id}`
  );

  return data;
};

export const createCompany = async (payload) => {
  const { data } = await api.post(
    "/organization/companies",
    payload
  );

  return data;
};

export const updateCompany = async (
  id,
  payload
) => {
  const { data } = await api.put(
    `/organization/companies/${id}`,
    payload
  );

  return data;
};

export const deleteCompany = async (id) => {
  const { data } = await api.delete(
    `/organization/companies/${id}`
  );

  return data;
};