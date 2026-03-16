"use client";

import { useActionState, useState, useEffect } from "react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { loginAction, type LoginActionState } from "@/actions/auth";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const initialState: LoginActionState = {};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }
  }, [state.error]);

  return (
    <motion.form
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      action={action}
      className="flex w-full max-w-[420px] flex-col gap-6"
    >
      <input type="hidden" name="next" value={next ?? ""} />

      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-1.5 text-center">
        <h1 className="font-display text-[28px] font-bold tracking-[-0.02em] text-neutral-900">
          Login
        </h1>
        <p className="text-[15px] text-neutral-400">
          Enter your details to continue
        </p>
      </motion.div>

      {/* Fields */}
      <div className="grid gap-4">
        <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
          <label className="field-label">Email</label>
          <Input
            name="email"
            type="email"
            placeholder="example@email.com"
            className="max-w-none"
            required
          />
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
          <label className="field-label">Password</label>
          <div className="relative">
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="max-w-none pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-3 top-1/2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-neutral-400 transition hover:text-neutral-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={showPassword ? "hide" : "show"}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                >
                  {showPassword ? (
                    <EyeOff className="size-[18px]" />
                  ) : (
                    <Eye className="size-[18px]" />
                  )}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </motion.div>

        {/* Remember me + Forgot password row */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Checkbox id="remember" />
            <label htmlFor="remember" className="field-label cursor-pointer">
              Remember me
            </label>
          </div>
          <button
            type="button"
            className="text-sm font-medium text-brand-primary hover:text-brand-dark transition-colors"
          >
            Forgot password?
          </button>
        </motion.div>
      </div>

      {/* Submit */}
      <motion.div variants={itemVariants}>
        <Button
          type="submit"
          disabled={pending}
          className="w-full h-[44px]"
        >
          <AnimatePresence mode="wait" initial={false}>
            {pending ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="inline-flex items-center"
              >
                <LoaderCircle className="size-4 animate-spin mr-2" />
                Signing in...
              </motion.span>
            ) : (
              <motion.span
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                Log in
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Sign up link */}
      <motion.p
        variants={itemVariants}
        className="text-center text-sm text-neutral-400"
      >
        Don&apos;t have an account?{" "}
        <button
          type="button"
          className="font-semibold text-neutral-900 hover:underline"
        >
          Sign up
        </button>
      </motion.p>
    </motion.form>
  );
}
