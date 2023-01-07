import * as express from "express";
import { stripe } from "../../clients";

const router = express.Router();

const WEBHOST = process.env.WEBHOST;
const PAYMENTSWEBURL = WEBHOST + "/payments";
const WEBURL_CONSOLE = WEBHOST + "/console";

router.get("/checkout-session", async (req, res) => {
  const { price: _q_price, onboarding: _q_onboarding } = req.query;
  const price = await stripe.prices.retrieve(_q_price as string, {
    expand: ["product"],
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
    success_url: `${PAYMENTSWEBURL}/success?session_id={CHECKOUT_SESSION_ID}&onboarding_id=${_q_onboarding}`,
    cancel_url: `${PAYMENTSWEBURL}/canceled`,
  });

  res.redirect(303, session.url);
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
