import { stripe } from "@/lib/clients";
import { getOnboardingApplication } from "@/lib/controllers/applications";
import { createCustomer, getCustomerWithEmail } from "@/lib/customers";
import { Customer } from "@/types/app";
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
  const tmp = await getOnboardingApplication(onboarding_id as string);
  const _email = tmp!.email;

  // if onboarding's email is placeholded. get email from checkout via stripe
  const email = _email?.endsWith("@unknown-users.cors.sh")
    ? customer_email ?? customer_details?.email
    : _email;

  // create customer
  // TODO: what if already exists?

  let customer_exists_with_same_email: Customer | undefined;
  try {
    const _customer = await getCustomerWithEmail(email!);
    if (_customer) customer_exists_with_same_email = _customer;
  } catch (e) {
    console.error("Caught exeption while finding existing customer", e);
  }

  if (customer_exists_with_same_email) {
    // TODO: we'll need a better way to handle this since we need to test this with same email multiple times.
    // we can't tell if the purchase is for the same user or not.
    // yet, if the existing one is verified, we should protect it.
    // if not, we should give the new one a chance.
    const _params = {
      error: "identity_conflict",
      message:
        "Your payment was successful, but we detected a suspicious activity. Please contact customer support.",
      session_id: session_id as string,
      onboarding_id: String(tmp?.id),
      application_id: String(tmp?.id),
    }
    const params = new URLSearchParams(_params);
    const redirect_uri = `${WEBHOST}/onboarding/payment-success-with-issue?${params.toString()}`;
    return NextResponse.redirect(redirect_uri, { status: 303 });
  } else {

    const customer = await createCustomer({
      stripe_customer_id: stripe_customer_id as string,
      email: email!,
    });

    const _params = {
      session_id: session_id as string,
      onboarding_id: tmp?.id ? String(tmp!.id) : undefined,
      customer_id: customer!.id,
      application_id: tmp?.id ? String(tmp?.id) : undefined,
    } as any as { [key: string]: string };

    // prettier-ignore
    Object.keys(_params).forEach((key) => (_params as any)[key] === undefined ? delete (_params as any)[key] : {});

    const params = new URLSearchParams(_params);

    const redirect_uri = `${WEBHOST}/onboarding/payment-success?${params.toString()}`;

    return NextResponse.redirect(redirect_uri, { status: 303 });
  }
}

