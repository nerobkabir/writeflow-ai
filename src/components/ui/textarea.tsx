import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex w-full rounded-lg border border-border bg-background px-3 py-2 text-[13px] text-foreground",
        "placeholder:text-muted-foreground outline-none transition-colors",
        "focus:border-foreground focus-visible:ring-0",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "resize-none min-h-[40px]",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
