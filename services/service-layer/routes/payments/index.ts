import { Stripe } from "stripe";
import * as express from "express";

const stripe = new Stripe(process.env.STRIPE_API_KEY, {
  apiVersion: "2022-08-01",
});

const router = express.Router();

const PAYMENTSWEBURL = "http://localhost:8823";

router.get("/create-checkout-session", async (req, res) => {
  const price = await stripe.prices.retrieve(req.query.price as string, {
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
    success_url: `${PAYMENTSWEBURL}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${PAYMENTSWEBURL}/payments/canceled`,
  });

  res.redirect(303, session.url);
});

export default router;
