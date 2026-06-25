import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { bindings } from "@/lib/control/bindings";
import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { BillingActions } from "@/components/billing-actions";
import { NotifyToggle } from "@/components/notify-toggle";

export const metadata = { title: "Account & billing" };

const TIER_LABEL: Record<string, string> = { free: "Free", pro: "Pro", team: "Team" };

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/console/settings");
  const email = session.user.email ?? "";
  const tier = session.user.tier ?? "free";
  const tierLabel = TIER_LABEL[tier] ?? "Free";

  const pref = await bindings()
    .DB.prepare("SELECT notify_quota FROM users WHERE id=?")
    .bind(session.user.id)
    .first<{ notify_quota: number }>();
  const notifyQuota = (pref?.notify_quota ?? 1) === 1;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Account &amp; billing</h1>
        <p className="text-sm text-muted-foreground">Manage your account and subscription.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <div className="flex items-center justify-between border-b py-2">
            <span className="text-muted-foreground">Email</span>
            <span>{email}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-muted-foreground">Plan</span>
            <Badge variant="secondary">{tierLabel}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing</CardTitle>
          <CardDescription>Upgrade or manage your subscription.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {tier === "free" ? (
              <>
                You&apos;re on the <strong className="text-foreground">Free</strong> plan — 10,000
                requests and 5 GB / month. Upgrade for 500,000 requests and 500 GB.
              </>
            ) : (
              <>
                You&apos;re on the <strong className="text-foreground">{tierLabel}</strong> plan.
                Manage your subscription, payment method, or cancel anytime.
              </>
            )}
          </p>
        </CardContent>
        <CardFooter>
          <BillingActions tier={tier} />
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Email alerts about your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <NotifyToggle initial={notifyQuota} />
        </CardContent>
      </Card>
    </div>
  );
}
