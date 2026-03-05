// src/services/defective.service.js
import { api } from "../lib/api";

// Base path (matches routes: /api/admin/defectives ...)
const BASE = "/api/admin/defectives";

export const DefectiveService = {
  // LIST (paginated)
  list: async ({ search = "", page = 1, perPage = 10 } = {}) => {
    const res = await api.get(BASE, {
      params: {
        page,                 // Laravel paginator uses `page` [web:636]
        per_page: perPage,    // match your controller query('per_page', 10)
        ...(search ? { search } : {}),
      },
    });
    return res.data; // { data, total, last_page, current_page, ... }
  },

  // VIEW (single)
  getById: async (id) => {
    const res = await api.get(`${BASE}/${id}`);
    return res.data; // { data: {...} }
  },

  // CREATE
  create: async (payload) => {
    const res = await api.post(BASE, payload);
    return res.data; // { message, data }
  },

  // UPDATE (PATCH)
  update: async (id, payload) => {
    const res = await api.patch(`${BASE}/${id}`, payload);
    return res.data; // { message, data }
  },

  // DELETE
  remove: async (id) => {
    const res = await api.delete(`${BASE}/${id}`);
    return res.data; // { message }
  },
};
