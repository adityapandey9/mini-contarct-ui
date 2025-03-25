"use client";

import { toast } from "sonner";
import { useEffect } from "react";
import { useNotificationStore } from "@/states/error";

export function ErrorToast() {
  useEffect(() => {
    useNotificationStore.subscribe(
      ({ title, description, duration, variant }) => {
        toast.call(variant, title, {
          description: description,
          duration: duration,
        });
      }
    );
  }, []);

  return null;
}
