// src/services/restock.service.js
import { api } from "../lib/api";

const BASE = "/api/admin/restock"; 

export const RestockService = {
  list: async ({ search = "", page = 1, perPage = 5, sortKey = "", sortDir = "asc" } = {}) => {
    const res = await api.get(BASE, {
      params: {
        page,
        per_page: perPage,
        ...(search ? { search } : {}),
        ...(sortKey ? { sort_by: sortKey, sort_dir: sortDir } : {}),
      },
    });
    return res.data;
  },
};
