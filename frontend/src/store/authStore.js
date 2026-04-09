import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchUser } from "@/api/auth";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      authChecked: false,

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

      restoreSession: async () => {
        const { isAuthenticated, login, logout } = get();
        const token = localStorage.getItem("token");

        if (!token) {
          set({ authChecked: true });
          return;
        }

        if (token && !isAuthenticated) {
          try {
            const user = await fetchUser();
            login(user, token);
          } catch (error) {
            console.error("Failed to restore session:", error);
            localStorage.removeItem("token");
            logout();
          } finally {
            set({ authChecked: true });
          }
          return;
        }

        set({ authChecked: true });
      },
    }),
    { name: "auth-storage" },
  ),
);

useAuthStore.getState().restoreSession();
