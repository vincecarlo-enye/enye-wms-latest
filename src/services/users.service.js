// src/services/users.service.js
import { api } from "../lib/api";

export const UsersService = {
  login: async ({ email, password }) => {
    const res = await api.post("/api/login", { email, password });
    return res.data;
  },

  saveAuth: ({ user, token }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
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
  },
};
