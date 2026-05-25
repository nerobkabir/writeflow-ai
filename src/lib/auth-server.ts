import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getAuthUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string } | undefined;
  return user?.id ?? null;
}
