import React from "react";
import copy from "copy-to-clipboard";
import { toast } from "sonner";
import { EyeOpenIcon } from "@radix-ui/react-icons";
import { cn } from "@workspace/ui/lib/utils";

export function ApiKeyReveal({
  keys,
}: {
  keys: { test: string; prod: string };
}) {
  const [masked, setMasked] = React.useState(true);

  const onCopy = (text: string) => {
    copy(text);
    toast.success("Copied to clipboard");
  };

  const keydisplay = (key: string, masked: boolean) => {
    if (masked) {
      // leave the first 5 characters as is
      // replace all characters except "-" that with x
      const first5 = key.slice(0, 5);
      const target = key.slice(5);
      // replace all characters except "-" with x
      const masked = target.replace(/[^-]/g, "x");
      return first5 + masked.slice(5);
    } else {
      return key;
    }
  };

  const Item = ({ sign: key }: { sign: string }) => {
    return (
      <span
        key={key}
        className="cursor-pointer hover:text-primary transition-colors"
        onClick={() => onCopy(key)}
      >
        <u>{keydisplay(key, masked)}</u>
        <br />
      </span>
    );
  };

  return (
    <div className="relative w-full p-5 bg-muted rounded-md font-mono text-xs overflow-x-auto">
      <button
        className={cn(
          "absolute top-3 right-3 p-1.5",
          "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
          "hover:bg-accent rounded-md",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        )}
        onClick={() => setMasked(false)}
        style={{
          visibility: masked ? "visible" : "hidden",
        }}
      >
        <EyeOpenIcon className="w-4 h-4" />
      </button>
      <pre className="m-0">
        API Keys
        <br />
        <br />
        # for testing
        <br />
        <Item sign={keys.test} />
        <br />
        <br />
        # for production
        <br />
        <Item sign={keys.prod} />
      </pre>
    </div>
  );
}
