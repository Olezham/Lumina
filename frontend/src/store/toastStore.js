import { create } from "zustand";

let idSeq = 1;

export const useToastStore = create((set) => ({
  toasts: [],
  pushToast: ({ type = "info", title = "", message = "", duration = 2600 }) => {
    const id = idSeq++;
    set((s) => ({
      toasts: [
        ...s.toasts,
        { id, type, title, message, duration: duration ?? 2600 },
      ],
    }));
    return id;
  },
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  clear: () => set({ toasts: [] }),
}));
