import { prisma } from "@/lib/prisma";

type AgentKey = "draft" | "rewrite" | "chat";

export async function isAgentEnabled(agent: AgentKey): Promise<boolean> {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
    select: {
      draftAgentOn: true,
      rewriteAgentOn: true,
      chatAgentOn: true,
    },
  });

  if (!settings) return true;
  if (agent === "draft") return settings.draftAgentOn;
  if (agent === "rewrite") return settings.rewriteAgentOn;
  return settings.chatAgentOn;
}
