// src/services/empborrowlist.service.js
import { api } from "../lib/api";

const BASE = "/api/employee/borrow-requests"; 
// If wala kang employee endpoint, set to admin endpoint:
// const BASE = "/api/admin/stock-request1";

const unwrapList = (res) => {
  const data = res?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data; // laravel pagination resource
  return [];
};

const unwrapItem = (res) => {
  const data = res?.data;
  return data?.data ?? data;
};

export const EmpBorrowListService = {
  // READ: list
  async list(params = {}) {
    const res = await api.get(BASE, { params });
    return unwrapList(res);
  },

  // READ: show
  async show(id) {
    const res = await api.get(`${BASE}/${id}`);
    return unwrapItem(res);
  },

  // CREATE
  async create(payload) {
    const res = await api.post(BASE, payload);
    return unwrapItem(res);
  },

  // UPDATE
  async update(id, payload) {
    const res = await api.put(`${BASE}/${id}`, payload);
    return unwrapItem(res);
  },

  // DELETE
  async destroy(id) {
    const res = await api.delete(`${BASE}/${id}`);
    return unwrapItem(res);
  },
};
