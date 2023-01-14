import type { Customer } from "@prisma/client";
import * as express from "express";
import { prisma, stripe } from "../../clients";
import { getOnboardingApplication } from "../../controllers/applications";

const router = express.Router();

const WEBHOST = process.env.WEBHOST;
const WEBURL_CONSOLE = WEBHOST + "/console";
const PROTOCOL = process.env.NODE_ENV === "production" ? "https" : "http";
// e.g.
// http://localhost:4021/payments/checkout/new?price=price_1Lda7UAvR3geCh5rVaajCSw6&onboarding_id=63b9a40c02478a88364d7202
router.get("/checkout/new", async (req, res) => {
  const host = req.headers.host;

  const { onboarding_id: _q_onboarding } = req.query;

  const onboarding = await getOnboardingApplication(_q_onboarding as string);

  if (!onboarding) {
    return res.status(400).json({ error: "invalid session" });
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

  res.redirect(303, session.url);
});

router.get("/success", async (req, res) => {
  const { session_id, onboarding_id } = req.query;

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
    res.redirect(303, redirect_uri);
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
    Object.keys(_params).forEach((key) => _params[key] === undefined ? delete _params[key] : {});

    const params = new URLSearchParams(_params);

    const redirect_uri = `${WEBHOST}/onboarding/payment-success?${params.toString()}`;

    res.redirect(303, redirect_uri);
  }
});

router.get("/canceled", async (req, res) => {
  // remove the temporary app
  const { session_id, onboarding_id } = req.query;

  res.redirect(303, `https://cors.sh/`);
});

router.post("/portal-session", async (req, res) => {
  // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
  // Typically this is stored alongside the authenticated user in your database.
  const { session_id } = req.body;
  const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

  // This is the url to which the customer will be redirected when they are done
  // managing their billing with the portal.
  const returnUrl = WEBURL_CONSOLE;

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: checkoutSession.customer as string,
    return_url: returnUrl,
  });

  res.redirect(303, portalSession.url);
});

export default router;
