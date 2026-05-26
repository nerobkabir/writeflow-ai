import { NextResponse } from "next/server";
import { resolveAuthUser } from "@/lib/auth-server";

export async function requireAdmin() {
  const user = await resolveAuthUser();
  if (!user) {
    return {
      user: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  if (user.role !== "ADMIN") {
    return {
      user: null,
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }
  return { user, error: null as NextResponse<unknown> | null };
}
