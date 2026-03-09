import { api } from "../lib/api";

const STOCK_REQUEST_BASE = "/api/admin/stock-request1";
const PRODUCTS_BASE = "/api/admin/products";

export const ReserveService = {
  listReserveRequests: async ({ search = "", stat = "", requestedBy = "" } = {}) => {
    const res = await api.get(STOCK_REQUEST_BASE, {
      params: {
        type: "reserve",
        ...(search ? { search } : {}),
        ...(stat !== "" ? { stat } : {}),
        ...(requestedBy ? { requested_by: requestedBy } : {}),
      },
    });
    return res.data;
  },

  getReserveRequestById: async (id) => {
    const res = await api.get(`${STOCK_REQUEST_BASE}/${id}`);
    return res.data;
  },

  updateReserveRequest: async (id, payload) => {
    const res = await api.put(`${STOCK_REQUEST_BASE}/${id}`, payload);
    return res.data;
  },

  deleteReserveRequest: async (id) => {
    const res = await api.delete(`${STOCK_REQUEST_BASE}/${id}`);
    return res.data;
  },

  listProducts: async ({ search = "" } = {}) => {
    const res = await api.get(PRODUCTS_BASE, {
      params: {
        ...(search ? { search } : {}),
      },
    });
    return res.data;
  },
};
