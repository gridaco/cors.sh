import type { Metadata } from "next";
import { Playground } from "@/components/playground";
import { bindings } from "@/lib/control/bindings";

// Reads a runtime binding (proxy base) → must render per request, not at build time.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Playground",
  description:
    "Fire a request from your browser, watch it get blocked by CORS, then watch the same request succeed through the cors.sh proxy. No API key required.",
};

export default function PlaygroundPage() {
  // Defaults to the production proxy; e2e overrides it to the local proxy via PLAYGROUND_PROXY_URL.
  const proxyBase = bindings().PLAYGROUND_PROXY_URL ?? "https://proxy.cors.sh";

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Playground</h1>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          Fire a request straight from your browser and watch it get blocked by CORS — then watch
          the same request sail through{" "}
          <code className="font-mono text-foreground">proxy.cors.sh</code>. No key required.
        </p>
      </div>
      <Playground proxyBase={proxyBase} />
    </div>
  );
}
