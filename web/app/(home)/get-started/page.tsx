import { redirect } from "next/navigation";

// The legacy Stripe onboarding is gone — onboarding now happens in the console.
export default function GetStartedPage() {
  redirect("/console/new");
}
