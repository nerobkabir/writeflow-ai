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
import { Logo } from "@/components/shared/Logo";

// Modular schema directly mapped to Zod requirements
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

// Password strength checker helper
const getPasswordStrength = (pass: string): { score: number; color: string } => {
  if (!pass) return { score: 0, color: "bg-neutral-200 dark:bg-neutral-800" };
  const len = pass.length;
  const hasNum = /\d/.test(pass);
  const hasSymbol = /[^A-Za-z0-9]/.test(pass);
  const hasUpper = /[A-Z]/.test(pass);
  const hasLower = /[a-z]/.test(pass);

  if (len >= 12 && hasNum && hasSymbol && hasUpper && hasLower) {
    return { score: 4, color: "bg-emerald-500" };
  }
  if (len >= 8 && hasSymbol) {
    return { score: 3, color: "bg-yellow-500" };
  }
  if (len >= 6 && hasNum) {
    return { score: 2, color: "bg-yellow-500" };
  }
  return { score: 1, color: "bg-red-500" };
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
      // Simulate backend generation registration latency
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Auto-login after successful validation and registry
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
    } catch (err) {
      toast.error("Registration failed. Verification checks suboptimal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 selection:bg-foreground selection:text-background font-sans">
      
      {/* Dynamic scaled card wrapper */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full max-w-md border border-border bg-surface rounded-xl p-8 shadow-sm space-y-6 animate-scaleIn"
      >
        {/* Header Block */}
        <div className="flex flex-col items-center text-center space-y-2">
          <Logo />
          <h2 className="text-2xl font-extrabold tracking-tight mt-4">Create your account</h2>
          <p className="text-[13px] text-muted-foreground">
            Get started with WriteFlow AI workspace
          </p>
        </div>

        {/* Inputs forms */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Full Name */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.06 }}
            className="space-y-1"
          >
            <label htmlFor="name" className="block text-[11px] font-bold text-muted-foreground uppercase">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="e.g. John Doe"
              className={`w-full px-3 py-2 text-[13.5px] rounded-lg bg-background border focus:border-accent outline-none transition-colors ${
                errors.name ? "border-error focus:border-error" : "border-border"
              }`}
              {...register("name")}
            />
            <AnimatePresence>
              {errors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[11px] text-error mt-0.5"
                >
                  {errors.name.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Email Address */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.12 }}
            className="space-y-1"
          >
            <label htmlFor="email" className="block text-[11px] font-bold text-muted-foreground uppercase">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@company.com"
              className={`w-full px-3 py-2 text-[13.5px] rounded-lg bg-background border focus:border-accent outline-none transition-colors ${
                errors.email ? "border-error focus:border-error" : "border-border"
              }`}
              {...register("email")}
            />
            <AnimatePresence>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[11px] text-error mt-0.5"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Password with Strength bar */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.18 }}
            className="space-y-1"
          >
            <label htmlFor="password" className="block text-[11px] font-bold text-muted-foreground uppercase">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full pl-3 pr-10 py-2 text-[13.5px] rounded-lg bg-background border focus:border-accent outline-none transition-colors ${
                  errors.password ? "border-error focus:border-error" : "border-border"
                }`}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Strength indicator layout */}
            <div className="grid grid-cols-4 gap-1.5 pt-1.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-200 ${
                    i < score ? color : "bg-neutral-200 dark:bg-neutral-800"
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
                  className="text-[11px] text-error mt-0.5"
                >
                  {errors.password.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Confirm Password */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.24 }}
            className="space-y-1"
          >
            <label htmlFor="confirmPassword" className="block text-[11px] font-bold text-muted-foreground uppercase">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full pl-3 pr-10 py-2 text-[13.5px] rounded-lg bg-background border focus:border-accent outline-none transition-colors ${
                  errors.confirmPassword ? "border-error focus:border-error" : "border-border"
                }`}
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <AnimatePresence>
              {errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[11px] text-error mt-0.5"
                >
                  {errors.confirmPassword.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Terms conditions Checkbox */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.3 }}
            className="space-y-1"
          >
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                className={`h-4 w-4 rounded bg-background border border-border focus:ring-accent accent-foreground`}
                {...register("terms")}
              />
              <span className="text-[12.5px] text-muted-foreground select-none">
                I accept the terms &amp; conditions
              </span>
            </label>
            <AnimatePresence>
              {errors.terms && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[11px] text-error mt-0.5"
                >
                  {errors.terms.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Action button */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.36 }}
            className="pt-2"
          >
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-foreground text-background rounded-lg font-bold text-[13px] hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
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
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Signing Up...</span>
                  </motion.span>
                ) : (
                  <motion.span
                    key="text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Register
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </motion.div>
        </form>

        {/* Redirect */}
        <p className="text-center text-[12.5px] text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-foreground hover:underline transition-all"
          >
            Sign In →
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
