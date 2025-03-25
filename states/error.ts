import { NotificationState } from "@/types/utils";
import { create } from "zustand";

export const useNotificationStore = create<NotificationState>((set) => ({
  title: null,
  duration: 0,
  description: "",
  variant: "success",
  showError: (notificationState) => set((state) => ({ ...notificationState })),
  clearError: () =>
    set({ title: null, duration: 0, description: "", variant: "error" }),
}));

export const { clearError, showError } = useNotificationStore.getState();
