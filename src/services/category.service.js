import { api } from "../lib/api";

export const CategoryService = {
  list: async ({ search = "", page = 1, perPage = 10 } = {}) => {
    const res = await api.get("/api/admin/categories", {
      params: { page, per_page: perPage, ...(search ? { search } : {}) },
    });
    return res.data;
  },

  getById: async (id) => (await api.get(`/api/admin/categories/${id}`)).data, // only if you add backend show()

  create: async ({ category, description }) =>
    (await api.post("/api/admin/categories", { category, description })).data,

  update: async (id, { category, description }) =>
    (await api.patch(`/api/admin/categories/${id}`, { category, description })).data,

  remove: async (id) => (await api.delete(`/api/admin/categories/${id}`)).data,
};
