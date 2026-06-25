import * as React from "react";
import { cn } from "@workspace/ui/lib/utils";
import { CopyButton } from "@/components/copy-button";

/**
 * A clean, dependency-free code surface. We intentionally avoid a syntax
 * highlighter — a monospace block with a copy affordance reads as modern and
 * keeps the bundle lean.
 */
export function CodeBlock({
  code,
  filename,
  className,
  copy = true,
}: {
  code: string;
  filename?: string;
  className?: string;
  copy?: boolean;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-muted/40 text-left",
        className
      )}
    >
      <div className="flex items-center justify-between border-b bg-muted/60 px-4 py-2">
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-red-400/70" />
          <span className="size-2.5 rounded-full bg-amber-400/70" />
          <span className="size-2.5 rounded-full bg-emerald-400/70" />
          {filename && (
            <span className="ml-3 font-mono text-xs text-muted-foreground">
              {filename}
            </span>
          )}
        </div>
        {copy && (
          <CopyButton
            value={code}
            size="icon"
            variant="ghost"
            className="size-7 opacity-0 transition-opacity group-hover:opacity-100"
          />
        )}
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
        <code className="font-mono text-foreground/90">{code}</code>
      </pre>
    </div>
  );
}
