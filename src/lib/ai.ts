import { AIResponse } from "@/types";

/**
 * Main AI Prompt Generator
 * Calls Anthropic's Claude API or falls back to an elegant local simulator
 */
export async function generateText(prompt: string, options: { maxTokens?: number; system?: string } = {}): Promise<AIResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey || apiKey === "mock-key") {
    // Elegant fallback simulation
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate networking
    return {
      success: true,
      text: simulateAIOutput(prompt),
    };
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: options.maxTokens || 1024,
        system: options.system || "You are a professional AI copywriter and assistant.",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.error?.message || `Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      text: data.content[0]?.text || "",
    };
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return {
      success: false,
      text: "",
      error: error.message || "Failed to communicate with AI endpoint",
    };
  }
}

/**
 * Text Rewriter (Shorten, Lengthen, Formal, Casual, Summarize)
 */
export async function rewriteText(
  text: string,
  mode: "shorten" | "lengthen" | "formal" | "casual" | "summarize" | "custom",
  customInstructions?: string
): Promise<AIResponse> {
  let prompt = "";
  switch (mode) {
    case "shorten":
      prompt = `Shorten the following text, keeping its core meaning intact and making it punchy:\n\n"${text}"`;
      break;
    case "lengthen":
      prompt = `Expand the following text naturally, adding supportive details, context, and clear explanations:\n\n"${text}"`;
      break;
    case "formal":
      prompt = `Rewrite the following text in a professional, polite, and formal tone suitable for business communication:\n\n"${text}"`;
      break;
    case "casual":
      prompt = `Rewrite the following text in a warm, engaging, and casual tone suitable for blog posts or social media:\n\n"${text}"`;
      break;
    case "summarize":
      prompt = `Provide a concise bulleted summary of the main points in the following text:\n\n"${text}"`;
      break;
    case "custom":
      prompt = `Rewrite the following text matching this instructions: ${customInstructions}.\n\nText:\n"${text}"`;
      break;
  }

  return generateText(prompt, {
    system: "You are a writing editor. Return ONLY the rewritten text without conversational introductions or explanations.",
  });
}

/**
 * Helper to simulate output based on prompts for local preview and testing
 */
function simulateAIOutput(prompt: string): string {
  const pLower = prompt.toLowerCase();
  
  if (pLower.includes("blog") || pLower.includes("outline")) {
    return `### Section 1: Introduction to WriteFlow AI\nIn today's fast-paced digital landscape, clarity and efficiency in writing are paramount. WriteFlow AI acts as a smart companion that bridges the gap between creativity and structured expression.\n\n### Section 2: Core Capabilities\n- **Deep Context Recognition**: Understands your target audience and intent instantly.\n- **Adaptive Style Rewriter**: Dynamically shifts tone from strict formal to engagingly casual.\n- **Subtle Spring Animations**: A dashboard experience designed for responsive focus.\n\n### Section 3: Key Takeaway\nEmpowering teams to ship better copy in minutes instead of hours. Start writing with flow!`;
  }

  if (pLower.includes("shorten")) {
    return "WriteFlow AI streamlines your drafting process by blending contextual intelligence with robust editorial controls, boosting your writing efficiency instantly.";
  }

  if (pLower.includes("formal")) {
    return "We are pleased to introduce WriteFlow AI, a state-of-the-art software application engineered to enhance corporate writing quality, facilitate style adaptations, and increase operational productivity.";
  }

  if (pLower.includes("casual")) {
    return "Hey there! Check out WriteFlow AI—it's this awesome new assistant that helps you write super clean copy in no time. Perfect for brainstorming and making your drafts pop!";
  }

  if (pLower.includes("summarize")) {
    return "- **High-Performance SaaS**: Built with Next.js, Framer Motion, and Tailwind CSS.\n- **Unified Flow**: Real-time writing assistant featuring direct rewrite tools.\n- **Premium Minimalist UI**: Tailored aesthetic layout focused on content creation.";
  }

  return `Here is a custom draft generated by WriteFlow AI's advanced contextual modeling engine:\n\nThis content is designed to align with your instructions regarding writing enhancements, clear messaging, and optimal delivery. We recommend reviewing the generated structure, adjusting key accents, and utilizing the real-time AI panel to refine the tone to your exact requirements.`;
}
