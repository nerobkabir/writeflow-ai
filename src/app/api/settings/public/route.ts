import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SETTINGS_ID = "singleton";

export async function GET() {
  try {
    const settings = await prisma.siteSettings.upsert({
      where: { id: SETTINGS_ID },
      update: {},
      create: { id: SETTINGS_ID },
      select: {
        siteName: true,
        logoUrl: true,
        maintenanceMode: true,
      },
    });

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Failed to load public settings:", error);
    return NextResponse.json(
      { error: "Failed to load public settings" },
      { status: 500 }
    );
  }
}
