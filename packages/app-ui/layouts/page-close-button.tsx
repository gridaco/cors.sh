import React from "react";
import { useRouter } from "next/router";
import { Cross2Icon } from "@radix-ui/react-icons";

export function PageCloseButton() {
  const router = useRouter();

  return (
    <button
      className="close"
      onClick={() => {
        router.replace("/");
      }}
    >
      <Cross2Icon />
    </button>
  );
}
