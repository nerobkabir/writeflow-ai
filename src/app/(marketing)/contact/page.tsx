"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MessageSquare, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

// Minimal inline SVGs
const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.enum(["General", "Sales", "Support", "Partnership"]),
  message: z.string()
    .min(20, "Message must be at least 20 characters")
    .max(1000, "Message must not exceed 1000 characters"),
});

type FormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "General",
      message: "",
    },
  });

  const messageWatch = form.watch("message") || "";

  const onSubmit = form.handleSubmit(async (values) => {
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error();
      }

      setSuccess(true);
      toast.success("Message sent successfully!");
    } catch (err) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col justify-center">
        <div className="mb-12 text-center sm:text-left space-y-3">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted bg-badge px-3 py-1.5 rounded-full border border-border/40 w-fit">
            Get in Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none text-foreground pt-1">
            Contact Support & Sales
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">
            Have questions about pricing, API integrations, or need general help? Let us know and our operations team will respond promptly.
          </p>
        </div>

        {/* 2-column desktop / stacked mobile grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-7 border border-border bg-surface rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden min-h-[460px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {!success ? (
                <motion.form
                  key="contact-form"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={onSubmit}
                  className="space-y-4 w-full"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="block space-y-1 text-sm">
                      <span className="text-xs font-semibold text-muted-foreground">Full Name</span>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-xs focus:border-foreground focus:outline-none transition-colors"
                        {...form.register("name")}
                      />
                      {form.formState.errors.name && (
                        <span className="text-[10px] font-semibold text-error block">
                          {form.formState.errors.name.message}
                        </span>
                      )}
                    </label>

                    <label className="block space-y-1 text-sm">
                      <span className="text-xs font-semibold text-muted-foreground">Email Address</span>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-xs focus:border-foreground focus:outline-none transition-colors"
                        {...form.register("email")}
                      />
                      {form.formState.errors.email && (
                        <span className="text-[10px] font-semibold text-error block">
                          {form.formState.errors.email.message}
                        </span>
                      )}
                    </label>
                  </div>

                  <label className="block space-y-1 text-sm">
                    <span className="text-xs font-semibold text-muted-foreground">Subject</span>
                    <select
                      className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-xs focus:border-foreground focus:outline-none transition-colors"
                      {...form.register("subject")}
                    >
                      <option value="General">General Inquiry</option>
                      <option value="Sales">Sales & Licensing</option>
                      <option value="Support">Technical Support</option>
                      <option value="Partnership">Partnerships</option>
                    </select>
                    {form.formState.errors.subject && (
                      <span className="text-[10px] font-semibold text-error block">
                        {form.formState.errors.subject.message}
                      </span>
                    )}
                  </label>

                  <label className="block space-y-1 text-sm relative">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground">Message</span>
                      <span className={`text-[10px] font-bold ${
                        messageWatch.length < 20 || messageWatch.length > 1000 
                          ? "text-muted-foreground" 
                          : "text-accent"
                      }`}>
                        {messageWatch.length} / 1000
                      </span>
                    </div>
                    <textarea
                      rows={5}
                      placeholder="Write your message here... (Min 20 characters)"
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-xs focus:border-foreground focus:outline-none transition-colors"
                      {...form.register("message")}
                    />
                    {form.formState.errors.message && (
                      <span className="text-[10px] font-semibold text-error block">
                        {form.formState.errors.message.message}
                      </span>
                    )}
                  </label>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full inline-flex items-center justify-center h-11 bg-foreground hover:bg-foreground/90 text-background text-xs font-bold rounded-xl disabled:opacity-60 transition-colors shadow-sm"
                    >
                      {sending ? "Sending message..." : "Send Message"}
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="success-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 28 }}
                  className="text-center space-y-5 py-8 w-full"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-success-bg text-success mx-auto shadow-sm">
                    <CheckCircle2 className="h-7 w-7 animate-bounce" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold tracking-tight text-foreground">Message Sent!</h2>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                      We've received your query and logged it into our operational database. Our support team will respond within 24 hours.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSuccess(false);
                      form.reset();
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground hover:underline"
                  >
                    <span>Send another message</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Contact Info & Status */}
          <div className="lg:col-span-5 space-y-6">
            {/* Contact details */}
            <div className="border border-border bg-surface rounded-2xl p-6 space-y-6 shadow-sm">
              <h2 className="font-bold text-[15px] tracking-tight border-b border-border/80 pb-3">
                Corporate Contacts
              </h2>

              <ul className="space-y-4">
                <li className="flex items-start gap-3.5">
                  <div className="h-9 w-9 bg-accent/5 border border-accent/10 rounded-lg flex items-center justify-center text-accent shrink-0 shadow-sm">
                    <Mail className="w-4.5 h-4.5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Email Address</span>
                    <a href="mailto:hello@writeflow.ai" className="text-xs font-semibold text-foreground hover:text-accent transition-colors">
                      hello@writeflow.ai
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <div className="h-9 w-9 bg-indigo-500/5 border border-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-500 shrink-0 shadow-sm">
                    <MessageSquare className="w-4.5 h-4.5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Discord Community</span>
                    <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-foreground hover:text-indigo-500 transition-colors">
                      Join Our Discord
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <div className="h-9 w-9 bg-sky-500/5 border border-sky-500/10 rounded-lg flex items-center justify-center text-sky-500 shrink-0 shadow-sm">
                    <TwitterIcon className="w-4.5 h-4.5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Twitter / X</span>
                    <a href="https://twitter.com/writeflow" target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-foreground hover:text-sky-500 transition-colors">
                      @writeflow
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            {/* Office hours & Operational status */}
            <div className="border border-border bg-surface rounded-2xl p-6 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <h2 className="font-bold text-[15px] tracking-tight">System Metrics</h2>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-success bg-success-bg border border-success/15 px-2.5 py-0.5 rounded-full select-none">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                  <span>OPERATIONAL</span>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="h-9 w-9 bg-emerald-500/5 border border-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500 shrink-0 shadow-sm">
                  <Clock className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Office Hours</span>
                  <p className="text-xs font-semibold text-foreground leading-relaxed">
                    Monday — Friday, 9:00 AM — 6:00 PM EST
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed leading-normal">
                    Queries submitted outside these limits are queued and processed the following business day.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
