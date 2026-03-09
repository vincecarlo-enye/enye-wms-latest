import { api } from "../lib/api";

export const DashboardService = {
  async summary(params = {}) {
    const res = await api.get("/api/admin/dashboard/stats", { params });
    return res.data;
  },
  async recentActivities() {
    const res = await api.get("/api/admin/recent-activities");
    return res.data;
  },
  async barcodeLookup(barcode) {
    const res = await api.get("/api/admin/barcode-lookup", {
      params: { barcode },
    });
    return res.data;
  },
};
