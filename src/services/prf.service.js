// src/services/prf.service.js
import { api } from "../lib/api";

const BASE = "/api/admin/prf";

const unwrapItem = (res) => {
  const data = res?.data;
  return data?.data ?? data;
};

export const PRFService = {
  async list(params = {}) {
    const res = await api.get(BASE, { params });
    return res.data; // paginated object (data, meta, links, etc.)
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

  async updateStatus(id, status) {
    const res = await api.patch(`${BASE}/${id}/status`, { status });
    return unwrapItem(res);
  },

  async destroy(id) {
    const res = await api.delete(`${BASE}/${id}`);
    return unwrapItem(res);
  },
};
