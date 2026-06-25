/**
 * Mock-reject API — the thing the correctness/trust layer tests against (PRD §5.6).
 * The point: produce the "blocked" case a real browser raises. Public fixtures (httpbin)
 * send `Access-Control-Allow-Origin: *` and therefore can't ever trigger a CORS error.
 */
export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const json = (status: number, headers: Record<string, string>) =>
      new Response(
        JSON.stringify({ ok: true, route: url.pathname, origin: request.headers.get("origin") }),
        { status, headers: { "content-type": "application/json", ...headers } }
      );

    switch (url.pathname) {
      // No ACAO → a direct cross-origin browser fetch is BLOCKED; via cors.sh it PASSES.
      case "/no-cors":
        return json(200, {});

      // ACAO pinned to a different origin → still blocked direct; proves cors.sh overrides it.
      case "/wrong-origin":
        return json(200, { "access-control-allow-origin": "https://not-your-origin.example" });

      // Fails the preflight when hit directly (no ACAO/Allow-* on OPTIONS); cors.sh answers OPTIONS itself.
      case "/needs-preflight":
        if (request.method === "OPTIONS") return new Response(null, { status: 403 });
        return json(200, {});

      // Control: always succeeds even without the proxy — harness self-check.
      case "/allow-all":
        return json(200, { "access-control-allow-origin": "*" });

      default:
        return new Response("mock routes: /no-cors /wrong-origin /needs-preflight /allow-all", { status: 404 });
    }
  },
};
