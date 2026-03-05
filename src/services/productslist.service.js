// src/services/productslist.service.js
import { api } from "../lib/api";

export const ProductListService = {
  list: async ({ search = "", category = "", page = 1, perPage = 10 } = {}) => {
    const res = await api.get("/api/admin/products", {
      params: {
        page,
        per_page: perPage,
        ...(search ? { search } : {}),
        ...(category ? { category } : {}),
      },
    });
    return res.data;
  },

  outOfStock: async ({ search = "", category = "", page = 1, perPage = 10 } = {}) => {
    const res = await api.get("/api/admin/products/out-of-stock", {
      params: {
        page,
        per_page: perPage, // make consistent
        ...(search ? { search } : {}),
        ...(category ? { category } : {}),
      },
    });
    return res.data;
  },
};

export const ProductService = {
  generateBarcode: async () => (await api.get("/api/admin/products/generate-barcode")).data,

  create: async (payload) => (await api.post("/api/admin/products", payload)).data,

  // VIEW
  getById: async (id) => (await api.get(`/api/admin/products/${id}`)).data,

  // UPDATE (PATCH)
  update: async (id, payload) => (await api.patch(`/api/admin/products/${id}`, payload)).data,

  // DELETE
  remove: async (id) => (await api.delete(`/api/admin/products/${id}`)).data,
};
