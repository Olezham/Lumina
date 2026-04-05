import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      register: (user, token) =>
        set(() => {
          localStorage.setItem("token", token);
          return { user, token, isAuthenticated: true };
        }),
      login: (user, token) =>
        set(() => {
          localStorage.setItem("token", token);
          return { user, token, isAuthenticated: true };
        }),
      logout: () =>
        set(() => {
          localStorage.removeItem("token");
          return { user: null, token: null, isAuthenticated: false };
        }),
    }),
    {
      name: "auth-storage",
    },
  ),
);
