// src/services/dispatch.service.js
import { api } from "../lib/api";

const BASE = "/api/admin/dispatches"; 

export const DispatchService = {
  list: async ({ search = "", page = 1, perPage = 5 } = {}) => {
    const res = await api.get(BASE, {
      params: {
        page,
        per_page: perPage, // backend needs to read this if you implement it; paginate uses page by default [web:636]
        ...(search ? { search } : {}),
      },
    });
    return res.data; // paginator object
  },

  getById: async (id) => {
    const res = await api.get(`${BASE}/${id}`);
    return res.data;
  },

  create: async (payload) => {
    const res = await api.post(BASE, payload);
    return res.data;
  },

  update: async (id, payload) => {
    const res = await api.put(`${BASE}/${id}`, payload); // axios.put(url, data) [web:932]
    return res.data;
  },

  cancel: async (id) => {
    const res = await api.put(`${BASE}/${id}/cancel`, {});
    return res.data;
  },

  receive: async (id) => {
    const res = await api.put(`${BASE}/${id}/receive`, {});
    return res.data;
  },
};
