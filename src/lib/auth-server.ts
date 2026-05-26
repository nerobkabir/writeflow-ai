import { getServerSession } from "next-auth";
import type { User } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { isDatabaseConnectionError } from "@/lib/db-error";
import { prisma } from "@/lib/prisma";
import { DEMO_USERS, ensureDemoUsers } from "@/lib/users";

function sessionToDemoUser(sessionUser: {
  id?: string;
  email?: string | null;
}): User | null {
  const email = sessionUser.email?.toLowerCase().trim();
  const demo = DEMO_USERS.find(
    (u) => u.id === sessionUser.id || (email && u.email === email)
  );
  if (!demo) return null;

  return {
    id: demo.id,
    name: demo.name,
    email: demo.email,
    password: null,
    role: demo.role,
    plan: demo.plan,
    avatar: demo.avatar,
    bio: demo.bio,
    isBanned: false,
    emailVerified: null,
    createdAt: new Date(0),
    updatedAt: new Date(0),
    deletedAt: null,
  };
}

/** Resolve the logged-in user against the database (handles stale JWT user ids). */
export async function resolveAuthUser(): Promise<User | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const sessionUser = session.user as { id?: string; email?: string | null };
  const email = sessionUser.email?.toLowerCase().trim();

  try {
    if (sessionUser.id) {
      const byId = await prisma.user.findUnique({ where: { id: sessionUser.id } });
      if (byId) return byId;
    }

    if (email) {
      await ensureDemoUsers();
      const byEmail = await prisma.user.findUnique({ where: { email } });
      if (byEmail) return byEmail;
    }
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      return sessionToDemoUser(sessionUser);
    }
    throw error;
  }

  return sessionToDemoUser(sessionUser);
}

export async function getAuthUserId(): Promise<string | null> {
  const user = await resolveAuthUser();
  return user?.id ?? null;
}
