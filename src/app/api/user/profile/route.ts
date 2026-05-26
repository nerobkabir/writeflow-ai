import { NextResponse } from "next/server";
import { resolveAuthUser } from "@/lib/auth-server";
import { isDatabaseConnectionError } from "@/lib/db-error";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await resolveAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      bio: user.bio ?? "",
      avatar: user.avatar,
      plan: user.plan,
    },
  });
}

export async function PATCH(request: Request) {
  const user = await resolveAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const name = body.name != null ? String(body.name).trim() : undefined;
  const bio = body.bio != null ? String(body.bio).slice(0, 200) : undefined;
  const avatar = body.avatar != null ? String(body.avatar) : undefined;

  try {
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(name !== undefined && name.length > 0 ? { name } : {}),
        ...(bio !== undefined ? { bio } : {}),
        ...(avatar !== undefined ? { avatar } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        avatar: true,
        plan: true,
      },
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      return NextResponse.json({
        user: {
          id: user.id,
          name: name ?? user.name,
          email: user.email,
          bio: bio ?? user.bio ?? "",
          avatar: avatar ?? user.avatar,
          plan: user.plan,
        },
        offline: true,
      });
    }
    console.error("PATCH /api/user/profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
