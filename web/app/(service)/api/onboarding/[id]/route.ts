import { getOnboardingApplication } from "@/lib/controllers/applications";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // this route does not have a guard by design.
  // get onboarding application (only public data)
  const { id } = params;

  const d = await getOnboardingApplication(id);

  if (!d) {
    return NextResponse.json(
      { error: "application not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(d, { status: 200 });
}
