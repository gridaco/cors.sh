import * as React from "react";
import { cn } from "@workspace/ui/lib/utils";
import { formatPercent } from "@/lib/format";

export function UsageMeter({
  label,
  used,
  total,
  format,
}: {
  label: string;
  used: number;
  total: number;
  format: (n: number) => string;
}) {
  const pct = formatPercent(used, total);
  const danger = pct >= 90;
  const warn = pct >= 75 && pct < 90;

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono text-xs">
          <span className="text-foreground">{format(used)}</span>
          <span className="text-muted-foreground"> / {format(total)}</span>
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            danger ? "bg-destructive" : warn ? "bg-amber-500" : "bg-foreground",
          )}
          style={{ width: `${Math.max(pct, 1.5)}%` }}
        />
      </div>
    </div>
  );
}
