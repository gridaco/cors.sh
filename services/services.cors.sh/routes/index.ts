import * as express from "express";
import router_payments from "./payments";
import router_stripe_webhooks from "./webhooks-stripe";
import router_applications from "./applications";
import router_start_key from "./start-key";
import cors from "cors";

const router = express.Router();

const cors_website_only = cors({
  origin: process.env.NODE_ENV === "production" ? "https://cors.sh" : "*",
});

// router.use("/", router_posts);
router.use("/payments", router_payments);
router.use("/webhooks/stripe", router_stripe_webhooks);
router.use("/applications", cors_website_only, router_applications);
router.use("/start-key", cors_website_only, router_start_key);
router.get("/", (req, res) => {
  res.redirect("https://cors.sh");
});
export default router;
