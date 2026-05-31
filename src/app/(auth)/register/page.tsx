"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { AuthShell, authInputClass, authLabelClass } from "@/components/auth/AuthShell";

const registerSchema = z
  .object({
    name: z.string().min(2, "Full Name must be at least 2 characters long"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Confirm Password is required"),
    terms: z.boolean().refine((val) => val === true, "You must accept the terms & conditions"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormInputs = z.infer<typeof registerSchema>;

const getPasswordStrength = (pass: string): { score: number; color: string } => {
  if (!pass) return { score: 0, color: "bg-border" };
  const len = pass.length;
  const hasNum = /\d/.test(pass);
  const hasSymbol = /[^A-Za-z0-9]/.test(pass);
  const hasUpper = /[A-Z]/.test(pass);
  const hasLower = /[a-z]/.test(pass);

  if (len >= 12 && hasNum && hasSymbol && hasUpper && hasLower) {
    return { score: 4, color: "bg-foreground" };
  }
  if (len >= 8 && hasSymbol) {
    return { score: 3, color: "bg-muted-foreground" };
  }
  if (len >= 6 && hasNum) {
    return { score: 2, color: "bg-muted-foreground" };
  }
  return { score: 1, color: "bg-error" };
};

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const passwordValue = watch("password", "");
  const { score, color } = getPasswordStrength(passwordValue);

  const onSubmit = async (data: RegisterFormInputs) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        toast.error("Auto-login failed. Please sign in manually.");
        router.push("/login");
      } else {
        toast.success("Account registered. Initializing your custom workspace...");
        router.refresh();
        router.push("/dashboard");
      }
    } catch {
      toast.error("Registration failed. Verification checks suboptimal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      mode="register"
      title="Join the Elite"
      subtitle="Initialize your clinical workspace intelligence."
      footer={
        <p className="text-center text-[12.5px] text-muted-foreground select-none">
          ALREADY INITIALIZED?{" "}
          <Link href="/login" className="font-extrabold text-foreground hover:underline uppercase tracking-wider text-[11.5px]">
            SIGN IN
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5">
        {/* Full name input */}
        <div className="space-y-1">
          <label htmlFor="name" className={authLabelClass}>
            Full Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="ENTER NAME"
            className={authInputClass(!!errors.name)}
            {...register("name")}
          />
          <AnimatePresence>
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-[11px] font-semibold text-error"
              >
                {errors.name.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Email input */}
        <div className="space-y-1">
          <label htmlFor="email" className={authLabelClass}>
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="ADDRESS@FLOW.AI"
            className={authInputClass(!!errors.email)}
            {...register("email")}
          />
          <AnimatePresence>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-[11px] font-semibold text-error"
              >
                {errors.email.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Password input */}
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="password" className={authLabelClass}>
              Password
            </label>
            <span className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-muted-foreground font-mono">
              STRENGTH:{" "}
              <span className={
                score === 4 ? "text-emerald-500" :
                score === 3 ? "text-neutral-400" :
                score === 2 ? "text-neutral-400" :
                score === 1 ? "text-error" : "text-neutral-500"
              }>
                {score === 4 ? "OPTIMAL" :
                 score === 3 ? "HIGH" :
                 score === 2 ? "MID" :
                 score === 1 ? "WEAK" : "VOID"}
              </span>
            </span>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`${authInputClass(!!errors.password)} pr-10 font-mono`}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          
          {/* Cybernetic Segment Indicators */}
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i < score ? color : "bg-neutral-800"
                }`}
              />
            ))}
          </div>

          <AnimatePresence>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-[11px] font-semibold text-error"
              >
                {errors.password.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Confirm password input */}
        <div className="space-y-1">
          <label htmlFor="confirmPassword" className={authLabelClass}>
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`${authInputClass(!!errors.confirmPassword)} pr-10 font-mono`}
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <AnimatePresence>
            {errors.confirmPassword && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-[11px] font-semibold text-error"
              >
                {errors.confirmPassword.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Terms check checkbox */}
        <div className="space-y-1 py-0.5">
          <label className="flex cursor-pointer items-start gap-2.5">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-border accent-foreground cursor-pointer bg-background"
              {...register("terms")}
            />
            <span className="text-[12px] text-muted-foreground hover:text-foreground transition-colors select-none leading-relaxed">
              I accept the{" "}
              <Link href="/terms" className="font-bold text-foreground hover:underline">
                terms &amp; conditions
              </Link>
            </span>
          </label>
          <AnimatePresence>
            {errors.terms && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-[11px] font-semibold text-error"
              >
                {errors.terms.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Action Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-foreground py-3 text-[12px] font-extrabold text-background uppercase tracking-[0.14em] hover:opacity-90 active:scale-[0.99] disabled:opacity-50 transition-all select-none cursor-pointer"
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.span
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                INITIALIZING WORKSPACE...
              </motion.span>
            ) : (
              <motion.span key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Register Protocol
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </form>
    </AuthShell>
  );
}
