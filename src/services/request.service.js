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

listBorrowRequests: async ({
  search = "",
  page = 1,
  perPage = 10,
  type = "borrow",
  stat = "",
  requestedBy = "",
} = {}) => {
  const res = await api.get(STOCK_REQUEST_BASE, {
    params: {
      page,
      per_page: perPage,
      ...(search ? { search } : {}),
      ...(type ? { type } : {}),
      ...(stat !== "" ? { stat } : {}),
      ...(requestedBy ? { requested_by: requestedBy } : {}),
    },
  });
  return res.data;
},


  getBorrowRequestById: async (id) => {
    const res = await api.get(`${STOCK_REQUEST_BASE}/${id}`);
    return res.data;
  },

  submitBorrowOrReserve: async (purpose, payload) => {
    const type = purpose === "reserve" ? "reserve" : "borrow";

    const mappedPayload = {
      srf_no: payload.srf_no ?? null,
      srf_no_ec: payload.srf_no_ec ?? null,
      type,
      dept_shname: payload.dept_shname ?? "",
      intended_for: payload.intended_for ?? "",
      used_for: payload.used_for ?? "",
      return_on: payload.return_on ?? "",
      item_type: payload.item_type ?? "",
      date_needed: payload.date_needed ?? "",
      warehouse: payload.warehouse ?? "",
      requested_by: payload.requested_by ?? "",
      remarks: payload.remarks ?? "",
      status: payload.status ?? "Pending",
      stat: payload.stat ?? 0,
      items: (payload.items || []).map((item) => ({
        prod_name: item.prod_name ?? item.productName ?? item.item ?? "",
        qty: Number(item.qty ?? item.quantity ?? 1),
        uom: item.uom ?? "",
        barcode: item.barcode ?? "",
        item_notes: item.item_notes ?? item.notes ?? "",
      })),
    };

    const res = await api.post(STOCK_REQUEST_BASE, mappedPayload);
    return res.data;
  },

  updateBorrowRequest: async (id, payload) => {
    const mappedPayload = {
      srf_no: payload.srf_no ?? null,
      srf_no_ec: payload.srf_no_ec ?? null,
      type: payload.type ?? "borrow",
      dept_shname: payload.dept_shname ?? "",
      intended_for: payload.intended_for ?? "",
      used_for: payload.used_for ?? "",
      return_on: payload.return_on ?? "",
      item_type: payload.item_type ?? "",
      date_needed: payload.date_needed ?? "",
      warehouse: payload.warehouse ?? "",
      requested_by: payload.requested_by ?? "",
      remarks: payload.remarks ?? "",
      status: payload.status ?? "Pending",
      stat: payload.stat ?? 0,
      ...(payload.items
        ? {
            items: payload.items.map((item) => ({
              prod_name: item.prod_name ?? item.productName ?? item.item ?? "",
              qty: Number(item.qty ?? item.quantity ?? 1),
              uom: item.uom ?? "",
              barcode: item.barcode ?? "",
              item_notes: item.item_notes ?? item.notes ?? "",
            })),
          }
        : {}),
    };

    const res = await api.put(`${STOCK_REQUEST_BASE}/${id}`, mappedPayload);
    return res.data;
  },

  deleteBorrowRequest: async (id) => {
    const res = await api.delete(`${STOCK_REQUEST_BASE}/${id}`);
    return res.data;
  },

  submitWarranty: async ({ payload, file }) => {
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
