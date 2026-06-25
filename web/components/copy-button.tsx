"use client";

import * as React from "react";
import copy from "copy-to-clipboard";
import { toast } from "sonner";
import { Check, Copy } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

export function CopyButton({
  value,
  label = "Copy",
  toastMessage = "Copied to clipboard",
  variant = "outline",
  size = "icon",
  className,
}: {
  value: string;
  label?: string;
  toastMessage?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
  className?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  const onCopy = () => {
    copy(value);
    setCopied(true);
    toast.success(toastMessage);
    setTimeout(() => setCopied(false), 1500);
  };

  const icon = copied ? (
    <Check className="size-4 text-emerald-500" />
  ) : (
    <Copy className="size-4" />
  );

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={onCopy}
      className={cn(className)}
      aria-label={label}
    >
      {icon}
      {size !== "icon" && <span>{copied ? "Copied" : label}</span>}
    </Button>
  );
}
