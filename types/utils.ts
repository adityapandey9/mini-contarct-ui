export type APIResponse<T, R = null> = T | R;

export interface NotificationState {
  title: string | null;
  description?: string;
  duration?: number;
  variant?: "error" | "success" | "info" | "warning";
  showError: (
    errorState: Omit<NotificationState, "showError" | "clearError">
  ) => void;
  clearError: () => void;
}
