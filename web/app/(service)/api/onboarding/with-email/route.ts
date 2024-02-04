import { NextResponse } from "next/server";
import { createOnboardingApplication } from "@/lib/controllers/applications";
import type { NextApiRequest, NextApiResponse } from "next";

export async function POST(req: Request) {
  // create new temporary application bind to the email (form is optional)

  const { email } = await req.json();

  // @requires: email
  if (!email) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  const d = await createOnboardingApplication({
    type: "with-email",
    email,
  });

  return NextResponse.json(d, { status: 201 });
}
