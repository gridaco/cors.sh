"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { CopyButton } from "@/components/copy-button";

function maskKey(key: string) {
  const prefix = key.slice(0, key.indexOf("_") + 1) || key.slice(0, 5);
  return `${prefix}${"•".repeat(24)}`;
}

export function ApiKeyField({
  value,
  keyType,
  defaultRevealed = false,
  inactive = false,
}: {
  value: string;
  keyType?: "live" | "test";
  defaultRevealed?: boolean;
  inactive?: boolean;
}) {
  const [revealed, setRevealed] = React.useState(defaultRevealed);

  return (
    <div className="flex items-center gap-2">
      {keyType && (
        <Badge
          variant={keyType === "live" ? "default" : "secondary"}
          className="w-12 shrink-0 justify-center font-mono text-[10px] uppercase"
        >
          {keyType}
        </Badge>
      )}
      <Input
        readOnly
        value={revealed ? value : maskKey(value)}
        onFocus={(e) => e.currentTarget.select()}
        className="font-mono text-xs tracking-tight"
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => setRevealed((v) => !v)}
        aria-label={revealed ? "Hide key" : "Reveal key"}
      >
        {revealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </Button>
      <CopyButton value={value} toastMessage={`${keyType ?? "API"} key copied`} />
      {inactive && (
        <Badge variant="outline" className="shrink-0 text-muted-foreground">
          inactive
        </Badge>
      )}
    </div>
  );
}
