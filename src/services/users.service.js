import { api } from "../lib/api";

const BASE = "/api/admin/users";

const unwrapItem = (res) => {
  const data = res?.data;
  return data?.data ?? data;
};

export const UsersService = {
  login: async ({ email, password }) => {
    const res = await api.post("/api/login", { email, password });
    return res.data;
  },

  saveAuth: ({ user, token }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    const role =
      user?.role || user?.roletype || user?.type || "";

    const warehouse =
      user?.warehouse ||
      (String(role).toLowerCase().includes("cebu") ? "cebu" : "main");

    localStorage.setItem("activeWarehouse", warehouse);
  },

  getLocalUser: () => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  },

  logout: async () => {
    const res = await api.post("/api/admin/logout");
    return res.data;
  },

  logoutLocal: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("activeWarehouse");
  },

  async list(params = {}) {
    const res = await api.get(BASE, { params });
    return res.data;
  },

  async show(id) {
    const res = await api.get(`${BASE}/${id}`);
    return unwrapItem(res);
  },

  async create(payload) {
    const res = await api.post(BASE, payload);
    return unwrapItem(res);
  },

  async update(id, payload) {
    const res = await api.put(`${BASE}/${id}`, payload);
    return unwrapItem(res);
  },

  async destroy(id) {
    const res = await api.delete(`${BASE}/${id}`);
    return res.data;
  },
};
