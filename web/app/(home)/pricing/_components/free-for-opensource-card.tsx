import React from "react";
import { CheckIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";

const oss_features = [
  "1,000,000 requests / month",
  "5mb per request",
  "Unlimited requests per hour",
  "No down time",
];

export default function FreeForOpensourceCard() {
  return (
    <div className="max-w-screen-lg border w-auto md:w-[940px] border-white/10 flex gap-20 flex-col-reverse justify-center md:flex-row md:justify-between md:gap-0 rounded-md p-12 pl-20 pr-20">
      <div className="flex-1 flex flex-col gap-7">
        {oss_features.map((t, i) => (
          <li key={i} className="flex gap-4 items-center">
            <span className="rounded-full bg-white text-black w-6 h-6 flex items-center justify-center">
              <CheckIcon width={18} height={18} />
            </span>
            <span className="text-sm">{t}</span>
          </li>
        ))}
      </div>
      <div className="flex-1 flex flex-col gap-7 items-stretch">
        <h2 className="text-4xl">
          <strong>Free </strong>
          <span className="opacity-80 font-light">for Open Source</span>
        </h2>
        <div className="flex flex-col gap-2 items-stretch">
          <Link
            href="https://github.com/gridaco/cors.sh/issues/new?template=apply-for-oss-program.yml"
            target="_blank"
          >
            <Button className="w-full">Apply</Button>
          </Link>
          <span className="text-xs text-muted-foreground text-center">
            *Limited to Public Projects that are on Github
          </span>
        </div>
      </div>
    </div>
  );
}
