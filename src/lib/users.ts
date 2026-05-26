import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const DEMO_USERS = [
  {
    id: "admin-phase1",
    name: "Alexander Admin",
    email: "admin@writeflow.com",
    password: "123456",
    role: "ADMIN" as const,
    plan: "TEAM" as const,
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
    bio: "Chief Content Architect & Operations Administrator.",
  },
  {
    id: "user-phase1",
    name: "John Writer",
    email: "user@writeflow.com",
    password: "123456",
    role: "USER" as const,
    plan: "PRO" as const,
    avatar:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80",
    bio: "Professional content creator and copywriter.",
  },
];

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, stored: string | null): Promise<boolean> {
  if (!stored) return false;
  if (stored.startsWith("$2")) {
    return bcrypt.compare(plain, stored);
  }
  return plain === stored;
}

/** Ensure demo users exist (idempotent) — safe to call from seed or auth */
export async function ensureDemoUsers() {
  for (const demo of DEMO_USERS) {
    const hashed = await hashPassword(demo.password);
    await prisma.user.upsert({
      where: { email: demo.email },
      update: {
        name: demo.name,
        password: hashed,
        role: demo.role,
        plan: demo.plan,
        avatar: demo.avatar,
        bio: demo.bio,
      },
      create: {
        id: demo.id,
        email: demo.email,
        name: demo.name,
        password: hashed,
        role: demo.role,
        plan: demo.plan,
        avatar: demo.avatar,
        bio: demo.bio,
      },
    });
  }
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
}
