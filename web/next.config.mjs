import createMDX from "@next/mdx";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Makes getCloudflareContext() (D1 + KV bindings) work under `next dev`.
// No-op for production builds / `opennextjs-cloudflare build`.
initOpenNextCloudflareForDev();

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui", "@workspace/emails"],
  // Let .md / .mdx files under app/ become routes (docs live in-app, no separate project).
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  redirects() {
    return [
      // Note: legacy keyless proxy traffic to `cors.sh/<url>` is handled by a Cloudflare route
      // (`cors.sh/http*` → proxy worker), NOT a Next redirect — a redirect breaks CORS preflight
      // and mangles the `//` in the target. So no `/http(s)://` rule here.
      {
        // if payment is canceled, go back to get started page.
        source: "/payments/canceled",
        destination: "/get-started",
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({ extension: /\.mdx?$/ });

export default withMDX(nextConfig);
