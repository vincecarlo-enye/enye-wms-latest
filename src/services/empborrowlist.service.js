// src/services/empborrowlist.service.js
import { api } from "../lib/api";

const BASE = "/api/admin/stock-request1";
// kapag may employee endpoint ka na saka mo lang palitan:
// const BASE = "/api/employee/borrow-requests";

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

export const EmpBorrowListService = {
  async list(params = {}) {
    const res = await api.get(BASE, { params: { type: "borrow", ...params } });
    return unwrapList(res);
  },

  async show(id) {
    const res = await api.get(`${BASE}/${id}`);
    return unwrapItem(res);
  },

  async create(payload) {
    const res = await api.post(BASE, payload);
    return unwrapItem(res);
  },

  async update(id, payload) {
    const res = await api.put(`${BASE}/${id}`, payload);
    return unwrapItem(res);
  },

  async destroy(id) {
    const res = await api.delete(`${BASE}/${id}`);
    return unwrapItem(res);
  },
};
