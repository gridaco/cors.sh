import { createOnboardingApplication } from "@/lib/controllers/applications";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // create new temporary application bind to the form (email is optional)
  const { name, allowedOrigins, priceId } = await request.json();

  const d = await createOnboardingApplication({
    type: "with-form",
    name,
    allowedOrigins,
    priceId,
  });

  return NextResponse.json(d, { status: 201 });
}
