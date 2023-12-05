import { stripe } from "@/lib/clients";
import { getOnboardingApplication } from "@/lib/controllers/applications";
import { NextResponse } from "next/server";
import { type NextRequest } from 'next/server'


const PROTOCOL = process.env.NODE_ENV === "production" ? "https" : "http";

// e.g.
// http://localhost:4021/payments/checkout/new?price=price_1Lda7UAvR3geCh5rVaajCSw6&onboarding_id=63b9a40c02478a88364d7202
export async function GET(request: NextRequest) {
  //
  const host = request.headers.get("host");

  const searchParams = request.nextUrl.searchParams;
  const _q_onboarding = searchParams.get("onboarding_id")

  const onboarding = await getOnboardingApplication(_q_onboarding as string);

  if (!onboarding) {
    return NextResponse.json({ error: "invalid session" }, { status: 400 });
  }

  const { priceId } = onboarding;

  const price = await stripe.prices.retrieve(priceId, {
    expand: ["product"],
  });

  const extra_params = new URLSearchParams({
    onboarding_id: _q_onboarding as string,
  });

  const session = await stripe.checkout.sessions.create({
    billing_address_collection: "auto",
    line_items: [
      {
        price: price.id,
        // For metered billing, do not pass quantity
        quantity: 1,
      },
    ],
    mode: "subscription",
    // e.g. http://localhost:8823/?success=true&session_id=cs_test_a1qQdhxwfS5kKZJ1kToxKqAr2K6yHneucfi65lIs1OPVkmoH14YNAev76S
    success_url: `${PROTOCOL}://${host}/payments/success?session_id={CHECKOUT_SESSION_ID}&${extra_params}`,
    cancel_url: `${PROTOCOL}://${host}/payments/canceled?session_id={CHECKOUT_SESSION_ID}&${extra_params}`,
  });

  return NextResponse.redirect(session.url, { status: 303 });
}
