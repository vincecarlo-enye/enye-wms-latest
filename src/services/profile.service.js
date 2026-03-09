// profile.service.js
import { api } from "../lib/api";

export const ProfileService = {
  async getProfile() {
    const res = await api.get("/api/profile");
    return res.data; 
  },

  async updateProfile(payload) {
    const res = await api.patch("/api/profile", payload);
    return res.data;
  },

  async changePassword({ oldPassword, newPassword }) {
    const res = await api.post("/api/profile/change-password", {
      current_password: oldPassword,
      password: newPassword,
      password_confirmation: newPassword,
    });
    return res.data;
  },
};
