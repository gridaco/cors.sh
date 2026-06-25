export type DocsNavItem = { title: string; href: string };
export type DocsNavSection = { title: string; items: DocsNavItem[] };

export const docsNav: DocsNavSection[] = [
  {
    title: "Getting started",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Quickstart", href: "/docs/quickstart" },
    ],
  },
  {
    title: "Guides",
    items: [
      { title: "Authentication", href: "/docs/authentication" },
      { title: "Errors & troubleshooting", href: "/docs/errors" },
      { title: "Limits & quotas", href: "/docs/limits" },
    ],
  },
  {
    title: "Reference",
    items: [{ title: "Proxy API", href: "/docs/api-reference" }],
  },
];

/** Flattened, in-order list for prev/next navigation. */
export const docsFlat: DocsNavItem[] = docsNav.flatMap((s) => s.items);
