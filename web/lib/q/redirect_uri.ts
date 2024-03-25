import type { ReadonlyURLSearchParams } from "next/navigation";

const key = "redirect_uri" as const;
/**
 * Parses the redirect uri from the given request
 * @returns {string} The redirect uri
 */
export function parse(
  searchParams: URLSearchParams | ReadonlyURLSearchParams
): string {
  try {
    return searchParams.get(key) || "";
  } catch (e) {
    return (searchParams as any)[key] || "";
  }
}

export function make<T = URL | string>(
  base: T,
  { redirect_uri }: { redirect_uri?: string }
): T | undefined {
  if (typeof base === "string" && base.startsWith("/")) {
    // relative path
    return (base + (redirect_uri ? `?${key}=${redirect_uri}` : "")) as T;
  }

  try {
    const url = typeof base === "string" ? new URL(base) : (base as URL);

    if (redirect_uri) {
      url.searchParams.set(key, redirect_uri);
    }
    return url as T;
  } catch (e) {
    return undefined;
  }
}

/**
 * Returns the absolute redirect uri
 * This is required for server redirect response
 */
export function abs({
  host,
  redirect_uri,
}: {
  host: string;
  redirect_uri: string;
}): string {
  // check if redirect_uri is absolute
  if (redirect_uri.startsWith("http")) {
    return redirect_uri;
  }

  // else,
  return host + redirect_uri;
}
