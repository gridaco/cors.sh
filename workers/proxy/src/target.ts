/**
 * Resolve the upstream target URL from the request.
 * Contract (legacy parity): the target is the path after the first slash
 * (`proxy.cors.sh/<target-url>`), OR the `x-strict-request-url` header when present
 * (lets clients pass URLs that path normalization would mangle — legacy issue #38).
 */
export function parseTarget(request: Request): string | null {
  const strict = request.headers.get("x-strict-request-url");
  if (strict && /^https?:\/\//i.test(strict)) return strict;

  const url = new URL(request.url);
  const target = url.pathname.slice(1) + url.search;
  return /^https?:\/\//i.test(target) ? target : null;
}
