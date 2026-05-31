"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, getSession } from "next-auth/react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2, User, Sparkles, Terminal } from "lucide-react";
import { loginSchema, LoginInput } from "@/lib/validations";
import { AuthShell, authInputClass, authLabelClass } from "@/components/auth/AuthShell";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" className="shrink-0">
    <path
      fill="currentColor"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="currentColor"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="currentColor"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="currentColor"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" className="shrink-0">
    <path
      fill="currentColor"
      d="M17.05 20.28c-.98.95-2.05 1.88-3.08 1.88-1.02 0-1.4-.61-2.55-.61-1.16 0-1.57.6-2.53.63-1.01.03-2.19-.98-3.17-1.96-2-2-3.53-5.63-3.53-9.06 0-5.44 3.5-8.31 6.94-8.31 1.09 0 2.11.4 2.78.79.67.39 1.62.9 2.22.9.6 0 1.34-.4 1.95-.73.68-.36 1.83-.86 3.12-.86 3.42 0 6.06 2.45 6.84 5.92-2.8.96-4.7 3.58-4.7 6.81 0 3.79 2.65 6.49 6.04 7.42-.71 2.05-2.39 4.18-4.36 6.18zM12.03 5c.42-3.08 2.9-5 5.09-5 .19 2.67-2.14 5.06-5.09 5z"
    />
  </svg>
);

function LoginContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        toast.error("Invalid credentials. Please verify your email and password.");
      } else {
        toast.success("Identity verified. Initializing workspace...");
        const session = await getSession();
        const userRole = (session?.user as { role?: string })?.role;
        router.refresh();
        if (userRole === "ADMIN") {
          router.push("/admin/analytics");
        } else {
          router.push("/dashboard");
        }
      }
    } catch {
      toast.error("A network or configuration exception occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (email: string, targetName: string) => {
    setValue("email", email, { shouldValidate: true });
    setValue("password", "123456", { shouldValidate: true });
    toast.success(`Demo credentials filled for: ${targetName}`);
  };

  return (
    <AuthShell
      mode="login"
      title="Welcome Back"
      subtitle="Enter your secure credentials to access the intelligence platform."
      footer={
        <p className="text-center text-[12.5px] text-muted-foreground select-none">
          New operative?{" "}
          <Link href="/register" className="font-extrabold text-foreground hover:underline uppercase tracking-wider text-[11.5px]">
            Request Access
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Email identity field */}
        <div className="space-y-1">
          <label htmlFor="email" className={authLabelClass}>
            Email Identity
          </label>
          <input
            id="email"
            type="email"
            placeholder="name@corporation.ai"
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

        {/* Password field */}
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="password" className={authLabelClass}>
              Access Protocol
            </label>
            <Link
              href="/forgot-password"
              className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground transition-colors"
            >
              Recovery
            </Link>
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

        {/* Persistent session checkbox */}
        <div className="flex items-center gap-2 py-0.5">
          <label className="flex cursor-pointer items-center gap-2 select-none">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-border accent-foreground cursor-pointer bg-background"
              defaultChecked
            />
            <span className="text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-colors leading-none">
              Persistent Session
            </span>
          </label>
        </div>

        {/* Main Action Button */}
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
                VERIFYING PROTOCOL...
              </motion.span>
            ) : (
              <motion.span key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Authorize Access
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Secondary Divider */}
        <div className="relative flex items-center py-1.5">
          <div className="flex-grow border-t border-border" />
          <span className="mx-3 shrink-0 text-[8.5px] font-bold uppercase tracking-[0.16em] text-muted-foreground select-none">
            Secondary Auth
          </span>
          <div className="flex-grow border-t border-border" />
        </div>

        {/* Google & Apple Multi-Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="flex items-center justify-center gap-2 rounded-lg border border-border bg-background py-2 text-[11.5px] font-bold text-foreground hover:border-foreground active:scale-[0.98] transition-all cursor-pointer"
          >
            <GoogleIcon />
            Google
          </button>
          <button
            type="button"
            onClick={() => toast.warning("Apple Identity Provider configuration suboptimal.")}
            className="flex items-center justify-center gap-2 rounded-lg border border-border bg-background py-2 text-[11.5px] font-bold text-foreground hover:border-foreground active:scale-[0.98] transition-all cursor-pointer"
          >
            <AppleIcon />
            Apple
          </button>
        </div>
      </form>

      {/* Upgraded Terminal-Styled Demo Control Box */}
      <div className="mt-4 rounded-xl border border-border/80 bg-background/50 p-3.5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-1 font-mono text-[7px] text-muted-foreground uppercase border-b border-l border-border select-none">
          SECURE BYPASS
        </div>
        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground flex items-center gap-1.5 select-none">
          <Terminal className="h-3 w-3" />
          [ QUICK ACCESS TERMINAL ]
        </p>
        <div className="mt-2.5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleDemoFill("user@writeflow.com", "Demo User")}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface py-1.5 text-[10.5px] font-mono font-bold tracking-wider uppercase hover:border-foreground hover:bg-background transition-all cursor-pointer"
          >
            <User className="h-3 w-3 text-muted-foreground" />
            User Demo
          </button>
          <button
            type="button"
            onClick={() => handleDemoFill("admin@writeflow.com", "Demo Admin")}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface py-1.5 text-[10.5px] font-mono font-bold tracking-wider uppercase hover:border-foreground hover:bg-background transition-all cursor-pointer"
          >
            <Sparkles className="h-3 w-3 text-muted-foreground" />
            Admin Demo
          </button>
        </div>
        <p className="mt-2.5 text-center text-[10px] text-muted-foreground leading-relaxed font-medium select-none">
          Click a demo token to pre-fill credentials, then authorize.
        </p>
      </div>
    </AuthShell>
  );
}


export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
