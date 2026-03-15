"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import { loginAction, type LoginActionState } from "@/actions/auth";

const initialState: LoginActionState = {};

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={action} className="surface-panel w-full max-w-xl gap-6 p-7 md:p-9">
      <input type="hidden" name="next" value={next ?? ""} />

      <div className="space-y-2">
        <p className="eyebrow">Secure sign in</p>
        <h1 className="font-display text-4xl font-semibold tracking-[-0.05em] text-neutral-950 md:text-5xl">
          Enter the control center.
        </h1>
        <p className="max-w-lg text-sm leading-7 text-neutral-500 md:text-base">
          Use your team credentials to open the permission-aware workspace. Access, sessions, and page routes resolve automatically after sign-in.
        </p>
      </div>

      <div className="grid gap-5">
        <label className="space-y-2 text-sm font-medium text-neutral-700">
          <span>Email address</span>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
            <input
              name="email"
              type="email"
              placeholder="admin@rbac-control.com"
              className="field-input h-13 pl-11"
              required
            />
          </div>
        </label>

        <label className="space-y-2 text-sm font-medium text-neutral-700">
          <span>Password</span>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="field-input h-13 pl-11 pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-3 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </label>
      </div>

      {state.error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-100">{state.error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-13 items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? <LoaderCircle className="size-4 animate-spin" /> : null}
        {pending ? "Signing in" : "Continue to dashboard"}
      </button>
    </form>
  );
}
