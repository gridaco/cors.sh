import { getCloudflareContext } from "@opennextjs/cloudflare";

/** The Cloudflare bindings available to server routes (D1 + KV), via OpenNext. */
export function bindings(): CloudflareEnv {
  return getCloudflareContext().env;
}
