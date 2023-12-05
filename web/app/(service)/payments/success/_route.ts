// import type { Customer } from "@prisma/client";
// import { prisma } from "../../clients";
import { stripe } from "@/lib/clients";
import { NextResponse, type NextRequest } from "next/server";

const WEBHOST = process.env.WEBHOST;

export async function GET(request: NextRequest) {

  const searchParams = request.nextUrl.searchParams;
  const session_id = searchParams.get("session_id");
  const onboarding_id = searchParams.get("onboarding_id");


  const checkout_session = await stripe.checkout.sessions.retrieve(
    session_id as string
  );

  const {
    customer: stripe_customer_id,
    customer_email, // can be null if created on checkout page (unless explicitly specified by our side.)
    customer_details,
    subscription,
  } = checkout_session;

  // on success, convert onboarding app to a real app (and remove the temporary app)
  // (if user has one.)

  // remove
  const tmp = await prisma.onboardingApplications.findUnique({
    where: { id: onboarding_id as string },
  });

  // if onboarding's email is placeholded. get email from checkout via stripe
  const email = tmp.email.endsWith("@unknown-users.cors.sh")
    ? customer_email ?? customer_details.email
    : tmp.email;

  // create customer
  // TODO: what if already exists?

  let customer_exists_with_same_email: Customer;
  try {
    customer_exists_with_same_email = await prisma.customer.findUnique({
      where: { email },
    });
  } catch (e) {
    console.error("Caught exeption while finding existing customer", e);
  }

  if (customer_exists_with_same_email) {
    // TODO: we'll need a better way to handle this since we need to test this with same email multiple times.
    // we can't tell if the purchase is for the same user or not.
    // yet, if the existing one is verified, we should protect it.
    // if not, we should give the new one a chance.
    const params = new URLSearchParams({
      error: "identity_conflict",
      message:
        "Your payment was successful, but we detected a suspicious activity. Please contact customer support.",
      session_id: session_id as string,
      onboarding_id: tmp.id,
      application_id: tmp.id,
    });
    const redirect_uri = `${WEBHOST}/onboarding/payment-success-with-issue?${params.toString()}`;
    return NextResponse.redirect(redirect_uri, { status: 303 });
  } else {
    const customer = await prisma.customer.create({
      data: {
        stripeId: stripe_customer_id as string,
        email: email,
        emailVerified: false,
      },
    });

    const _params = {
      session_id: session_id as string,
      onboarding_id: tmp?.id,
      customer_id: customer.id,
      application_id: tmp.id,
    };

    // prettier-ignore
    Object.keys(_params).forEach((key) => (_params as any)[key] === undefined ? delete (_params as any)[key] : {});

    const params = new URLSearchParams(_params);

    const redirect_uri = `${WEBHOST}/onboarding/payment-success?${params.toString()}`;

    return NextResponse.redirect(redirect_uri, { status: 303 });
  }
}

