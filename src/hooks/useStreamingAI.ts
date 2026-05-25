import { useState, useCallback } from "react";
import { generateText } from "@/lib/ai";

export function useStreamingAI() {
  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const streamText = useCallback(async (prompt: string, systemPrompt?: string) => {
    setIsGenerating(true);
    setError(null);
    setOutput("");

    try {
      const response = await generateText(prompt, { system: systemPrompt });

      if (!response.success) {
        throw new Error(response.error || "Failed to generate text");
      }

      const words = response.text.split(" ");
      let currentText = "";
      
      // Animate word-by-word to simulate streaming
      for (let i = 0; i < words.length; i++) {
        currentText += (i === 0 ? "" : " ") + words[i];
        
        // Use a functional state update to prevent closure race conditions
        const nextText = currentText;
        await new Promise((resolve) => {
          setTimeout(() => {
            setOutput(nextText);
            resolve(null);
          }, Math.max(10, 50 - words.length * 0.1)); // Dynamic speed adjustments
        });
      }
    } catch (err: any) {
      console.error("Streaming AI Error:", err);
      setError(err.message || "An unexpected generation error occurred");
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { output, isGenerating, error, streamText, setOutput };
}
export default useStreamingAI;
