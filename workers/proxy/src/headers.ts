/** Request headers dropped before forwarding to the upstream. */
const STRIP_REQUEST = new Set([
  // hop-by-hop + runtime-managed
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "content-length",
  "host",
  // legacy strips
  "cookie",
  "cookie2",
  // never leak our auth/control headers upstream (fixes a legacy leak — recon §1)
  "x-cors-api-key",
  "x-cors-grida-api-key",
  "x-strict-request-url",
]);

export function buildForwardHeaders(request: Request): Headers {
  const h = new Headers();
  for (const [k, v] of request.headers) {
    if (!STRIP_REQUEST.has(k.toLowerCase())) h.set(k, v);
  }
  return h;
}

/** Copy upstream response headers, stripping cookies (legacy parity). CORS is applied on top. */
export function sanitizeResponseHeaders(upstream: Response): Headers {
  const h = new Headers(upstream.headers);
  h.delete("set-cookie");
  h.delete("set-cookie2");
  return h;
}
