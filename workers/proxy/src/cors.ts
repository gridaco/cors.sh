/**
 * CORS policy — reconstructed from legacy (`utils.ts withCORS`) and verified in spike 7.6,
 * with one v1 improvement: emit `Access-Control-Max-Age` so browsers cache the preflight
 * (legacy emitted none → re-preflighted every call). PRD §5.1.
 */
const MAX_AGE = "600"; // 10 minutes

export function applyCors(request: Request, headers: Headers): Headers {
  headers.set("access-control-allow-origin", "*"); // legacy policy: hard-coded * (no credentials)

  const acrm = request.headers.get("access-control-request-method");
  if (acrm) headers.set("access-control-allow-methods", acrm); // reflect requested method

  const acrh = request.headers.get("access-control-request-headers");
  if (acrh) headers.set("access-control-allow-headers", acrh); // reflect requested headers

  if (request.method === "OPTIONS") headers.set("access-control-max-age", MAX_AGE);

  headers.set("access-control-expose-headers", [...headers.keys()].join(","));
  return headers;
}

/** OPTIONS short-circuit: 200 + CORS, empty body, never forwarded/authed/metered. */
export function handlePreflight(request: Request): Response | null {
  if (request.method !== "OPTIONS") return null;
  return new Response(null, { status: 200, headers: applyCors(request, new Headers()) });
}
