import { convertApplication } from "@/lib/controllers/applications";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id: onboarding_id } = params;
  const { checkout_session_id } = await request.json();

  const application = await convertApplication({
    onboarding_id,
    checkout_session_id,
  });

  return NextResponse.json(application, { status: 201 });
}
