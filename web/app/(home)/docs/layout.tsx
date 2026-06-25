import * as React from "react";
import { DocsSidebar } from "./_components/docs-sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-6xl gap-10 px-6 py-10">
      <DocsSidebar />
      <article className="min-w-0 max-w-3xl flex-1 pb-16">{children}</article>
    </div>
  );
}
