import { Stripe } from "stripe";
import * as express from "express";

const stripe = new Stripe(process.env.STRIPE_API_KEY, {
  apiVersion: "2022-08-01",
});

const router = express.Router();

const PAYMENTSWEBURL = "http://localhost:8823";

router.post("/create-checkout-session", async (req, res) => {
  const price = await stripe.prices.retrieve(req.body.lookup_key as string, {
    expand: ["product"],
  });
  console.log("req.body.lookup_key", req.body.lookup_key);
  console.log("prices", price);
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
    success_url: `${PAYMENTSWEBURL}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${PAYMENTSWEBURL}?canceled=true`,
  });

  res.redirect(303, session.url);
});

export default router;