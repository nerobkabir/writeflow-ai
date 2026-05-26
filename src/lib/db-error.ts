import { Prisma } from "@prisma/client";

/** True when Prisma cannot reach the database (network / Supabase down). */
export function isDatabaseConnectionError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code === "P1001" || error.code === "P1002" || error.code === "P1017";
  }
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return true;
  }
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("Can't reach database server") ||
    message.includes("Connection timed out") ||
    message.includes("ECONNREFUSED")
  );
}

export function databaseErrorMessage(): string {
  return "Database is temporarily unavailable. Working in offline demo mode — changes are saved locally until the connection returns.";
}
