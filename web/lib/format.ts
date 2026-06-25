/** Display helpers shared across the console. */

const NF = new Intl.NumberFormat("en-US");

export function formatNumber(n: number): string {
  return NF.format(n);
}

/** 536870912000 → "500 GB", 3663 → "3.6 KB". */
export function humanizeBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** i;
  const rounded = value >= 100 || i === 0 ? Math.round(value) : Math.round(value * 10) / 10;
  return `${rounded} ${units[i]}`;
}

export function formatPercent(used: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((used / total) * 100));
}

/** Unix-ms → "Jun 25, 2026". */
export function formatDate(ms: number): string {
  if (!ms) return "—";
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Unix-ms → "3 days ago". */
export function formatRelative(ms: number): string {
  if (!ms) return "—";
  const diff = Date.now() - ms;
  const s = Math.round(diff / 1000);
  const m = Math.round(s / 60);
  const h = Math.round(m / 60);
  const d = Math.round(h / 24);
  if (s < 60) return "just now";
  if (m < 60) return `${m} min ago`;
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  if (d < 30) return `${d} day${d === 1 ? "" : "s"} ago`;
  return formatDate(ms);
}
