export type UserRole = "USER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  name?: string | null;
  role: UserRole;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  userId: string;
  templateId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Template {
  id: string;
  slug: string;
  name: string;
  description: string;
  prompt: string;
  category: string;
  icon: string;
  isPremium: boolean;
  usageCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  title: string;
  company: string;
  avatar: string;
  isFeatured: boolean;
  createdAt?: Date;
}

export interface Usage {
  id: string;
  userId: string;
  wordCount: number;
  tokensUsed: number;
  month: number;
  year: number;
}

export interface AIResponse {
  text: string;
  success: boolean;
  error?: string;
}
