"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";

async function postBilling(path: string, body?: object): Promise<void> {
  const res = await fetch(path, {
    method: "POST",
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
  if (data.url) {
    window.location.href = data.url;
    return;
  }
  throw new Error(data.error || "Billing is unavailable right now.");
}

export function BillingActions({ tier }: { tier: string }) {
  const [busy, setBusy] = React.useState<string | null>(null);

  async function go(key: string, path: string, body?: object) {
    setBusy(key);
    try {
      await postBilling(path, body);
    } catch (e) {
      toast.error((e as Error).message);
      setBusy(null);
    }
  }

  if (tier === "free") {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => go("monthly", "/api/billing/checkout", { interval: "monthly" })}
          disabled={busy !== null}
        >
          {busy === "monthly" ? "Redirecting…" : "Upgrade to Pro — $4/mo"}
        </Button>
        <Button
          variant="outline"
          onClick={() => go("annual", "/api/billing/checkout", { interval: "annual" })}
          disabled={busy !== null}
        >
          Pay annually
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={() => go("portal", "/api/billing/portal")}
      disabled={busy !== null}
    >
      {busy === "portal" ? "Opening…" : "Manage billing"}
    </Button>
  );
}
