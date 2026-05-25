"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

// Modular schema direct declaration
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormInputs = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormInputs>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormInputs) => {
    setLoading(true);
    try {
      // Simulate API delivery request
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmittedEmail(data.email);
      setIsSuccess(true);
      toast.success(`Verification link dispatched to ${data.email}`);
    } catch (err) {
      toast.error("Failed to submit request. Network exception.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 selection:bg-foreground selection:text-background font-sans">
      
      {/* Dynamic scaled card wrapper */}
      <div className="w-full max-w-md border border-border bg-surface rounded-xl p-8 shadow-sm relative overflow-hidden">
        
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            /* STEP 1: INPUT EMAIL */
            <motion.div
              key="step-input"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="flex flex-col items-center text-center space-y-2">
                <Logo />
                <h2 className="text-2xl font-extrabold tracking-tight mt-4">Reset password</h2>
                <p className="text-[13px] text-muted-foreground">
                  Enter your email and we&apos;ll send you a link to reset your password.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                
                {/* Email address input */}
                <div className="space-y-1">
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
                </div>

                {/* Send Button */}
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
                        <span>Sending Link...</span>
                      </motion.span>
                    ) : (
                      <motion.span
                        key="text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Send Reset Link</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </form>

              {/* Back to sign in */}
              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground hover:text-foreground font-semibold transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </motion.div>
          ) : (
            /* STEP 2: CHECK EMAIL INSTRUCTIONS */
            <motion.div
              key="step-success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="text-center space-y-6 py-4"
            >
              {/* Success layout */}
              <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-success-bg border border-success/30 flex items-center justify-center text-success">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-extrabold tracking-tight">Check your inbox</h2>
                  <p className="text-[13px] text-muted-foreground">
                    Password recovery instructions dispatched
                  </p>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-background border border-border rounded-lg p-4 text-[13px] text-muted-foreground leading-relaxed">
                An email containing a secure password reset link has been sent to <strong className="text-foreground">{submittedEmail}</strong>. Please check your spam folder if it does not arrive within 5 minutes.
              </div>

              {/* Back to login */}
              <div className="text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground hover:text-foreground font-semibold transition-colors border border-border rounded-lg px-4 py-2 bg-background shadow-sm hover:border-accent"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to login</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
