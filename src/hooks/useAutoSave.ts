import { useEffect, useState, useRef } from "react";

export type SaveState = "idle" | "saving" | "saved" | "error";

interface UseAutoSaveProps<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  delay?: number;
}

export function useAutoSave<T>({ data, onSave, delay = 2000 }: UseAutoSaveProps<T>) {
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const isFirstRender = useRef(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const latestDataRef = useRef(data);

  // Keep track of the latest data so we always save the most recent version
  useEffect(() => {
    latestDataRef.current = data;
  }, [data]);

  useEffect(() => {
    // Skip auto-saving on initial render/mount
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setSaveState("saving");

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await onSave(latestDataRef.current);
        setSaveState("saved");
        // Clear saved indicator after 2s
        setTimeout(() => setSaveState("idle"), 2000);
      } catch (err) {
        console.error("AutoSave Error:", err);
        setSaveState("error");
      }
    }, delay);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [data, delay, onSave]);

  return { saveState };
}
export default useAutoSave;
