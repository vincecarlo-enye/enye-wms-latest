import { api } from "../lib/api";

export const CategoryService = {
  list: async ({ search = "", page = 1, perPage = 1000 } = {}) => {
    const res = await api.get(getCategoryPath(), {
      params: { page, per_page: perPage, ...(search ? { search } : {}) },
    });
    return res.data;
  },

  getById: async (id) =>
    (await api.get(`${getCategoryPath()}/${id}`)).data,

  create: async ({ category, description }) =>
    (await api.post(getCategoryPath(), { category, description })).data,

  update: async (id, { category, description }) =>
    (await api.patch(`${getCategoryPath()}/${id}`, { category, description })).data,

  remove: async (id) => {
    try {
      const res = await api.delete(`${getCategoryPath()}/${id}`);
      return res.data;
    } catch (err) {
      console.error("Delete category error:", err);
      throw err;
    }
  },
};

function getCategoryPath() {
  const warehouse = localStorage.getItem("activeWarehouse") || "main";
  return warehouse === "cebu"
    ? "/api/admin/cebu/categories"
    : "/api/admin/categories";
}
