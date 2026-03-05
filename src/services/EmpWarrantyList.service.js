import { api } from "../lib/api";

const BASE = "/api/admin/replacements"; 

const unwrapList = (res) => {
  const data = res?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const unwrapItem = (res) => {
  const data = res?.data;
  return data?.data ?? data;
};

export const EmpWarrantyListService = {
  async list(params = {}) {
    const res = await api.get(BASE, { params });
    return unwrapList(res);
  },
  async show(id) {
    const res = await api.get(`${BASE}/${id}`);
    return unwrapItem(res);
  },
};
