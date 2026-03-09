// src/services/replacement.service.js
import { api } from "../lib/api";

const REPLACEMENT_BASE = "/api/admin/replacements";

export const ReplacementService = {
  listReplacements: async ({
    search = "",
    stat = "",
    requestedBy = "",
  } = {}) => {
    const params = {
      ...(search ? { search } : {}),
      ...(stat !== "" ? { stat } : {}),
      ...(requestedBy ? { requested_by: requestedBy } : {}),
    };

    const res = await api.get(REPLACEMENT_BASE, { params });
    return res.data;
  },

  getReplacementById: async (id) => {
    const res = await api.get(`${REPLACEMENT_BASE}/${id}`);
    return res.data;
  },

  createReplacement: async (payload) => {
    const mappedPayload = {
      srf_no: payload.srf_no ?? null,
      srf_no_ec: payload.srf_no_ec ?? null,
      ref_no: payload.ref_no ?? "",
      dept_shname: payload.dept_shname ?? "",
      client_name: payload.client_name ?? "",
      project_name: payload.project_name ?? "",
      dr_no: payload.dr_no ?? "",
      delivery_date: payload.delivery_date ?? "",
      item_type_rep: payload.item_type_rep ?? "",
      principal_invoice: payload.principal_invoice ?? "",
      supplied_by: payload.supplied_by ?? "",
      warranty_claimed: payload.warranty_claimed ?? "",
      replacement_date: payload.replacement_date ?? "",
      remarks: payload.remarks ?? "",
      requested_by: payload.requested_by ?? "",
      type: payload.type ?? "replacement",
      status: payload.status ?? "Pending",
      stat: payload.stat ?? 0,
      date: payload.date ?? null,
      items: (payload.items || []).map((item) => ({
        prod_name: item.prod_name ?? item.item ?? "",
        qty: Number(item.qty ?? item.quantity ?? 1),
        uom: item.uom ?? "",
        barcode: item.barcode ?? "",
      })),
    };

    const res = await api.post(REPLACEMENT_BASE, mappedPayload);
    return res.data;
  },

  updateReplacement: async (id, payload) => {
    const mappedPayload = {
      srf_no: payload.srf_no ?? null,
      srf_no_ec: payload.srf_no_ec ?? null,
      ref_no: payload.ref_no ?? "",
      dept_shname: payload.dept_shname ?? "",
      client_name: payload.client_name ?? "",
      project_name: payload.project_name ?? "",
      dr_no: payload.dr_no ?? "",
      delivery_date: payload.delivery_date ?? "",
      item_type_rep: payload.item_type_rep ?? "",
      principal_invoice: payload.principal_invoice ?? "",
      supplied_by: payload.supplied_by ?? "",
      warranty_claimed: payload.warranty_claimed ?? "",
      replacement_date: payload.replacement_date ?? "",
      remarks: payload.remarks ?? "",
      requested_by: payload.requested_by ?? "",
      type: payload.type ?? "replacement",
      status: payload.status ?? "Pending",
      stat: payload.stat ?? 0,
      date: payload.date ?? null,
      ...(payload.items
        ? {
            items: payload.items.map((item) => ({
              prod_name: item.prod_name ?? item.item ?? "",
              qty: Number(item.qty ?? item.quantity ?? 1),
              uom: item.uom ?? "",
              barcode: item.barcode ?? "",
            })),
          }
        : {}),
    };

    const res = await api.put(`${REPLACEMENT_BASE}/${id}`, mappedPayload);
    return res.data;
  },

  deleteReplacement: async (id) => {
    const res = await api.delete(`${REPLACEMENT_BASE}/${id}`);
    return res.data;
  },
};
