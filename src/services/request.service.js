// src/services/request.service.js
import { api } from "../lib/api";

const PRODUCTS_BASE = "/api/admin/products";
const STOCK_REQUEST_BASE = "/api/admin/stock-request1";
const WARRANTY_BASE = "/api/admin/warranties";

export const RequestService = {
  listProducts: async ({ search = "", page = 1, perPage = 200 } = {}) => {
    const res = await api.get(PRODUCTS_BASE, {
      params: {
        page,
        per_page: perPage,
        ...(search ? { search } : {}),
      },
    });
    return res.data;
  },

  submitBorrowOrReserve: async (purpose, payload) => {
    // temporary: both borrow/reserve goes to stock-request1
    const res = await api.post(STOCK_REQUEST_BASE, { ...payload, purpose });
    return res.data;
  },

  submitWarranty: async ({ payload, file }) => {
    // Only works if WarrantyController supports multipart file
    if (file) {
      const form = new FormData();
      Object.entries(payload).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        form.append(k, typeof v === "object" ? JSON.stringify(v) : String(v));
      });
      form.append("file", file);

      const res = await api.post(WARRANTY_BASE, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    }

    const res = await api.post(WARRANTY_BASE, payload);
    return res.data;
  },
};
