import { api } from "../lib/api";

export const LogsService = {
  async list(params = {}) {
    // backend routes: GET /api/admin/logs
    const res = await api.get("/api/admin/logs", { params });
    return res.data; // Laravel paginator
  },

  async create(payload) {
    // POST /api/admin/logs
    const res = await api.post("/api/admin/logs", payload);
    return res.data;
  },
};
