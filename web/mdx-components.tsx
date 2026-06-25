import type { MDXComponents } from "mdx/types";
import * as React from "react";
import Link from "next/link";

/**
 * Global styling for MDX-rendered docs. App Router picks this up automatically
 * for every .md/.mdx page — keeps the docs on the same design system as the app.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props: React.ComponentPropsWithoutRef<"h1">) => (
      <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight" {...props} />
    ),
    h2: (props: React.ComponentPropsWithoutRef<"h2">) => (
      <h2
        className="mt-12 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight"
        {...props}
      />
    ),
    h3: (props: React.ComponentPropsWithoutRef<"h3">) => (
      <h3 className="mt-8 scroll-m-20 text-lg font-semibold tracking-tight" {...props} />
    ),
    p: (props: React.ComponentPropsWithoutRef<"p">) => (
      <p className="mt-4 leading-7 text-muted-foreground" {...props} />
    ),
    a: ({ href = "", ...props }: React.ComponentPropsWithoutRef<"a">) => {
      const internal = href.startsWith("/") || href.startsWith("#");
      const className =
        "font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground";
      return internal ? (
        <Link href={href} className={className} {...props} />
      ) : (
        <a href={href} target="_blank" rel="noreferrer" className={className} {...props} />
      );
    },
    ul: (props: React.ComponentPropsWithoutRef<"ul">) => (
      <ul
        className="mt-4 ml-6 list-disc space-y-2 text-muted-foreground marker:text-border"
        {...props}
      />
    ),
    ol: (props: React.ComponentPropsWithoutRef<"ol">) => (
      <ol className="mt-4 ml-6 list-decimal space-y-2 text-muted-foreground" {...props} />
    ),
    li: (props: React.ComponentPropsWithoutRef<"li">) => <li className="leading-7" {...props} />,
    code: (props: React.ComponentPropsWithoutRef<"code">) => (
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em]" {...props} />
    ),
    pre: (props: React.ComponentPropsWithoutRef<"pre">) => (
      <pre
        className="mt-4 overflow-x-auto rounded-xl border bg-muted/40 p-4 font-mono text-[13px] leading-relaxed [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-foreground/90"
        {...props}
      />
    ),
    blockquote: (props: React.ComponentPropsWithoutRef<"blockquote">) => (
      <blockquote
        className="mt-4 border-l-2 border-border pl-4 text-muted-foreground italic"
        {...props}
      />
    ),
    hr: (props: React.ComponentPropsWithoutRef<"hr">) => (
      <hr className="my-10 border-border" {...props} />
    ),
    strong: (props: React.ComponentPropsWithoutRef<"strong">) => (
      <strong className="font-semibold text-foreground" {...props} />
    ),
    ...components,
  };
}
