"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Label } from "@workspace/ui/components/label";
import { Badge } from "@workspace/ui/components/badge";
import { Alert, AlertDescription, AlertTitle } from "@workspace/ui/components/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { cn } from "@workspace/ui/lib/utils";
import { CodeBlock } from "@/components/code-block";
import { humanizeBytes } from "@/lib/format";

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;
type Method = (typeof METHODS)[number];

// Default to our own mock (mock.cors.sh) — purpose-built to reject CORS, so the *direct* request
// reliably fails and the proxied one returns clean JSON. `/wrong-origin` is also blocked (its ACAO
// points elsewhere); the real-API chip is CORS-open, so its direct request succeeds — itself useful
// to see (not every endpoint needs the proxy).
const EXAMPLES = [
  "https://mock.cors.sh/no-cors",
  "https://mock.cors.sh/wrong-origin",
  "https://api.github.com/repos/gridaco/cors.sh",
];

const MAX_BODY = 100 * 1024; // cap what we render; bodies can be huge

type RunResult =
  | {
      ok: true;
      status: number;
      statusText: string;
      ms: number;
      headers: [string, string][];
      body: string;
      truncated: boolean;
      fullSize: number;
    }
  | { ok: false; ms: number; errorName: string; errorMessage: string };

/** "Header: value" per line → object. Blank and `#` lines are ignored. */
function parseHeaders(text: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf(":");
    if (i === -1) continue;
    const k = t.slice(0, i).trim();
    if (k) out[k] = t.slice(i + 1).trim();
  }
  return out;
}

async function timedFetch(url: string, init: RequestInit): Promise<RunResult> {
  const start = performance.now();
  try {
    const r = await fetch(url, init);
    const ms = Math.round(performance.now() - start);
    const raw = await r.text();
    const fullSize = raw.length;
    let body = raw;
    // Pretty-print JSON when parseable; otherwise show as-is.
    try {
      body = JSON.stringify(JSON.parse(raw), null, 2);
    } catch {
      // not JSON — leave raw text
    }
    const truncated = body.length > MAX_BODY;
    return {
      ok: true,
      status: r.status,
      statusText: r.statusText,
      ms,
      headers: [...r.headers.entries()],
      body: truncated ? body.slice(0, MAX_BODY) : body,
      truncated,
      fullSize,
    };
  } catch (e) {
    const err = e as Error;
    return {
      ok: false,
      ms: Math.round(performance.now() - start),
      errorName: err.name || "Error",
      errorMessage: String(err.message || err),
    };
  }
}

export function Playground({ proxyBase }: { proxyBase: string }) {
  const [url, setUrl] = React.useState(EXAMPLES[0]!);
  const [method, setMethod] = React.useState<Method>("GET");
  const [apiKey, setApiKey] = React.useState("");
  const [headersText, setHeadersText] = React.useState("");
  const [body, setBody] = React.useState("");
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [direct, setDirect] = React.useState<RunResult | null>(null);
  const [proxied, setProxied] = React.useState<RunResult | null>(null);

  const hasBody = method !== "GET";
  const base = proxyBase.replace(/\/$/, "");
  const proxiedUrl = `${base}/${url}`;

  async function run() {
    if (!/^https?:\/\//i.test(url)) {
      toast.error("Enter an absolute http(s) URL");
      return;
    }
    setPending(true);
    setDirect(null);
    setProxied(null);

    const headers = parseHeaders(headersText);
    const init: RequestInit = {
      method,
      headers,
      body: hasBody && body ? body : undefined,
    };
    const [d, p] = await Promise.all([
      timedFetch(url, init), // direct: no key, the browser enforces CORS
      timedFetch(proxiedUrl, {
        ...init,
        headers: { ...headers, ...(apiKey ? { "x-cors-api-key": apiKey } : {}) },
      }),
    ]);
    setDirect(d);
    setProxied(p);
    setPending(false);
  }

  function snippet(): string {
    const out = [
      `await fetch(${JSON.stringify(proxiedUrl)}, {`,
      `  method: ${JSON.stringify(method)},`,
      "  headers: {",
    ];
    for (const [k, v] of Object.entries(parseHeaders(headersText))) {
      out.push(`    ${JSON.stringify(k)}: ${JSON.stringify(v)},`);
    }
    out.push(
      apiKey
        ? `    "x-cors-api-key": ${JSON.stringify(apiKey)},`
        : `    // "x-cors-api-key": "live_…",  // optional — anonymous works too`,
    );
    out.push("  },");
    if (hasBody && body) out.push(`  body: ${JSON.stringify(body)},`);
    out.push("});");
    return out.join("\n");
  }

  return (
    <div className="mt-10 space-y-6">
      {/* Request bar */}
      <div className="rounded-2xl border bg-background p-4 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select value={method} onValueChange={(v) => setMethod(v as Method)}>
            <SelectTrigger className="h-9 w-full sm:w-28" aria-label="HTTP method">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {METHODS.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            aria-label="Target URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") run();
            }}
            placeholder="https://api.example.com/data"
            className="h-9 flex-1 font-mono"
            spellCheck={false}
          />
          <Button onClick={run} disabled={pending} className="h-9 sm:w-28">
            {pending ? <Loader2Icon className="animate-spin" /> : null}
            {pending ? "Running" : "Run"}
          </Button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <span className="mr-1">Try:</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setUrl(ex)}
              className="rounded-full border bg-muted/40 px-2 py-0.5 font-mono transition-colors hover:bg-muted hover:text-foreground"
            >
              {ex.replace(/^https?:\/\//, "")}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowAdvanced((s) => !s)}
          className="mt-4 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {showAdvanced ? "− Hide" : "+ Show"} advanced — API key, headers{hasBody ? ", body" : ""}
        </button>

        {showAdvanced && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="pg-key" className="text-xs">
                API key <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="pg-key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="live_… / test_… — blank = anonymous"
                className="h-9 font-mono"
                spellCheck={false}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pg-headers" className="text-xs">
                Request headers <span className="text-muted-foreground">(one per line)</span>
              </Label>
              <Textarea
                id="pg-headers"
                value={headersText}
                onChange={(e) => setHeadersText(e.target.value)}
                placeholder={"Authorization: Bearer …\nAccept: application/json"}
                className="resize-y font-mono text-xs"
                rows={3}
              />
            </div>
            {hasBody && (
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="pg-body" className="text-xs">
                  Request body
                </Label>
                <Textarea
                  id="pg-body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder={'{ "hello": "world" }'}
                  className="resize-y font-mono text-xs"
                  rows={4}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results: direct (blocked) vs via proxy (success) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ResultPanel
          label="Direct browser request"
          subtitle="no proxy"
          kind="direct"
          result={direct}
          pending={pending}
        />
        <ResultPanel
          label="Via proxy.cors.sh"
          subtitle={base}
          kind="proxy"
          result={proxied}
          pending={pending}
        />
      </div>
      <p className="text-center text-xs text-muted-foreground">
        Both requests run in your browser&apos;s own <code className="font-mono">fetch()</code>, so
        CORS is genuinely enforced — this isn&apos;t a server-side simulation.
      </p>

      {/* Copy-as-fetch */}
      <div>
        <h2 className="mb-2 text-sm font-medium">Copy this request</h2>
        <CodeBlock code={snippet()} filename="proxied-request.js" />
      </div>
    </div>
  );
}

function ResultPanel({
  label,
  subtitle,
  kind,
  result,
  pending,
}: {
  label: string;
  subtitle: string;
  kind: "direct" | "proxy";
  result: RunResult | null;
  pending: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-col rounded-2xl border bg-background">
      <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
        <div className="min-w-0">
          <div className="text-sm font-medium">{label}</div>
          <div className="truncate font-mono text-[11px] text-muted-foreground">{subtitle}</div>
        </div>
        {result &&
          (result.ok ? (
            <Badge
              variant="outline"
              className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
            >
              {result.status}
              {result.statusText ? ` ${result.statusText}` : ""} · {result.ms} ms
            </Badge>
          ) : (
            <Badge variant="destructive">Blocked · {result.ms} ms</Badge>
          ))}
      </div>

      <div className="p-4">
        {pending && !result && <p className="text-xs text-muted-foreground">Running…</p>}
        {!pending && !result && (
          <p className="text-xs text-muted-foreground">Run a request to see the result.</p>
        )}

        {result && !result.ok && (
          <Alert variant="destructive">
            <AlertTitle>
              {kind === "direct" ? "Blocked by the browser" : "Request failed"}
            </AlertTitle>
            <AlertDescription className="space-y-2">
              {kind === "direct" ? (
                <p>
                  The browser refused to expose this response — almost certainly a CORS error.
                  JavaScript can&apos;t read the exact reason; open{" "}
                  <strong>DevTools → Network</strong> to see it. This is exactly what cors.sh fixes
                  — compare the panel on the right.
                </p>
              ) : null}
              <p className="font-mono text-[11px] text-destructive">
                {result.errorName}: {result.errorMessage}
              </p>
            </AlertDescription>
          </Alert>
        )}

        {result && result.ok && (
          <Tabs defaultValue="body" className="min-w-0 flex-col">
            <TabsList>
              <TabsTrigger value="body">Body</TabsTrigger>
              <TabsTrigger value="headers">Headers ({result.headers.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="body" className="mt-3 min-w-0">
              <CodeBlock code={result.body || "(empty body)"} copy={result.body.length > 0} />
              {result.truncated && (
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  Showing the first {humanizeBytes(MAX_BODY)} of {humanizeBytes(result.fullSize)}.
                </p>
              )}
            </TabsContent>
            <TabsContent value="headers" className="mt-3 min-w-0">
              <dl className="divide-y overflow-hidden rounded-xl border text-xs">
                {result.headers.map(([k, v]) => {
                  const cors = k.toLowerCase().startsWith("access-control-");
                  return (
                    <div
                      key={k}
                      className={cn(
                        "grid grid-cols-[minmax(0,13.5rem)_1fr] gap-2 px-3 py-1.5",
                        cors && "bg-emerald-500/5",
                      )}
                    >
                      <dt
                        className={cn(
                          "truncate font-mono",
                          cors ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground",
                        )}
                      >
                        {k}
                      </dt>
                      <dd className="font-mono break-all">{v}</dd>
                    </div>
                  );
                })}
              </dl>
              {kind === "proxy" && (
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  <span className="text-emerald-600 dark:text-emerald-400">access-control-*</span>{" "}
                  headers are injected by cors.sh — that&apos;s why the browser allowed this
                  response.
                </p>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
