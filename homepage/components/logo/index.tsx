import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";

export function Logo({ moveToHome = false }: { moveToHome?: boolean }) {
  const router = useRouter();
  const onClick = () => {
    if (moveToHome) {
      router.push("/");
    }
  };
  return <Image onClick={onClick} src={"/logo.svg"} height={20} width={100} />;
}
