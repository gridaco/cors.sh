import { stripe } from "@/lib/clients";
import { NextRequest, NextResponse } from "next/server";

const WEBHOST = process.env.WEBHOST;
const WEBURL_CONSOLE = WEBHOST + "/console";

export async function POST(request: NextRequest) {
  // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
  // Typically this is stored alongside the authenticated user in your database.
  const { session_id } = await request.json();
  const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

  // This is the url to which the customer will be redirected when they are done
  // managing their billing with the portal.
  const returnUrl = WEBURL_CONSOLE;

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: checkoutSession.customer as string,
    return_url: returnUrl,
  });

  return NextResponse.redirect(portalSession.url, { status: 303 });
}
