// src/services/productslist.service.js
import { api } from "../lib/api";

function getProductBasePath() {
  const warehouse = localStorage.getItem("activeWarehouse") || "main";
  return warehouse === "cebu"
    ? "/api/admin/cebu/products"
    : "/api/admin/products";
}

export const ProductListService = {
  list: async ({
    search = "",
    category = "",
    page = 1,
    perPage = 10,
  } = {}) => {
    const res = await api.get(getProductBasePath(), {
      params: {
        page,
        per_page: perPage,
        ...(search ? { search } : {}),
        ...(category ? { category } : {}),
      },
    });
    return res.data;
  },

  getById: async (id) =>
    (await api.get(`${getProductBasePath()}/${id}`)).data,
};

export const ProductService = {
  create: async (payload) =>
    (await api.post(getProductBasePath(), payload)).data,

  update: async (id, payload) =>
    (await api.patch(`${getProductBasePath()}/${id}`, payload)).data,

  remove: async (id) =>
    (await api.delete(`${getProductBasePath()}/${id}`)).data,
};
