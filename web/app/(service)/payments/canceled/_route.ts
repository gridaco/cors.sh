import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const session_id = searchParams.get("session_id");
  const onboarding_id = searchParams.get("onboarding_id");

  return NextResponse.redirect(`https://cors.sh/`, { status: 303 });
}
