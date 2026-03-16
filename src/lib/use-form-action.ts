"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import type { ActionState } from "@/actions/resources";

const initialState: ActionState = {};

/**
 * Wraps useActionState and automatically shows sonner toasts
 * for success / error responses from server actions.
 */
export function useFormAction(
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>,
  options?: { successMessage?: string },
) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const prevStateRef = useRef(state);

  useEffect(() => {
    if (state === prevStateRef.current) return;
    prevStateRef.current = state;

    if (state.error) {
      toast.error(state.error);
    }
    if (state.success) {
      toast.success(state.success ?? options?.successMessage);
    }
  }, [state, options?.successMessage]);

  return { state, formAction, pending };
}
