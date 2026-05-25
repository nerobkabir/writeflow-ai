import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const documentSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  content: z.string().optional().default(""),
});

export type DocumentInput = z.infer<typeof documentSchema>;

export const templateSchema = z.object({
  name: z.string().min(2, "Template name is required"),
  slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/, "Must be kebab-case"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  prompt: z.string().min(10, "AI Prompt must be at least 10 characters"),
  category: z.string().min(2, "Category is required"),
  icon: z.string().default("Sparkles"),
  isPremium: z.boolean().default(false),
});

export type TemplateInput = z.infer<typeof templateSchema>;

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

export type ProfileInput = z.infer<typeof profileSchema>;

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
});
