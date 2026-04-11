import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchUser, logoutUser } from "@/api/auth";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      authChecked: false,

      register: (user) =>
        set(() => {
          return { user, isAuthenticated: true };
        }),

      login: (user) =>
        set(() => {
          return { user, isAuthenticated: true };
        }),

      logout: async () => {
        try {
          await logoutUser();
        } catch (error) {
          console.error("Failed to logout cleanly:", error);
        } finally {
          set({ user: null, isAuthenticated: false, authChecked: true });
        }
      },

      restoreSession: async () => {
        const { login } = get();

        try {
          const user = await fetchUser();
          login(user);
        } catch (error) {
          console.error("Failed to restore session:", error);
          set({ user: null, isAuthenticated: false });
        } finally {
          set({ authChecked: true });
        }
      },
    }),
    { name: "auth-storage" },
  ),
);
