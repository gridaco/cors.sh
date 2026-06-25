/** Generate an api key: `{live|test}_<48 hex>`. (Public identifier; the Origin is the auth — SPEC §3.) */
export function generateKey(type: "live" | "test"): string {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${type}_${hex}`;
}

export function newId(): string {
  return crypto.randomUUID();
}
