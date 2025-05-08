"use client";
import React, { useEffect } from "react";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { Input } from "@workspace/ui/components/input";

export function EditableTitle({
  initialValue = "",
}: {
  initialValue?: string;
}) {
  const [editing, setEditing] = React.useState(false);
  const [text, setText] = React.useState(initialValue);
  const ref = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      ref.current?.focus();
      ref.current?.setSelectionRange(0, text.length);
    }
  }, [editing]);

  return (
    <div className="relative flex items-center justify-between gap-2 group">
      <Input
        className="text-2xl font-bold text-center border-none focus-visible:ring-0 focus-visible:ring-offset-0"
        style={{
          cursor: editing ? "text" : "pointer",
        }}
        onDoubleClick={() => setEditing(true)}
        onBlur={() => setEditing(false)}
        ref={ref}
        readOnly={!editing}
        onChange={(e) => {
          setText(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setEditing(false);
          }
        }}
        value={text}
      />
      <button
        className="absolute right-0 top-0 bottom-0 m-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{
          visibility: editing ? "hidden" : "visible",
        }}
        onClick={() => setEditing(true)}
      >
        <Pencil1Icon className="w-4 h-4" />
      </button>
    </div>
  );
}
