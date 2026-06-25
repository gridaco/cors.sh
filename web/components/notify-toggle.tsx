"use client";

import * as React from "react";
import { toast } from "sonner";
import { Switch } from "@workspace/ui/components/switch";
import { Label } from "@workspace/ui/components/label";

export function NotifyToggle({ initial }: { initial: boolean }) {
  const [on, setOn] = React.useState(initial);
  const [busy, setBusy] = React.useState(false);

  async function change(v: boolean) {
    setOn(v);
    setBusy(true);
    try {
      const res = await fetch("/api/v1/account", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ notifyQuota: v }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setOn(!v);
      toast.error("Couldn't save that preference. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <Label htmlFor="notify-quota" className="font-normal">
        Email me when I approach my monthly quota
      </Label>
      <Switch id="notify-quota" checked={on} disabled={busy} onCheckedChange={change} />
    </div>
  );
}
