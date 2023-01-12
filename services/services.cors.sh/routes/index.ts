import * as express from "express";
import router_payments from "./payments";
import router_stripe_webhooks from "./webhooks-stripe";
import router_applications from "./applications";
import router_onboarding from "./onboarding";
import router_auth from "./auth";
import cors from "cors";
import { authMiddleware } from "../auth";

const router = express.Router();

const cors_website_only = cors({
  origin: process.env.NODE_ENV === "production" ? "https://cors.sh" : "*",
});

// router.use("/", router_posts);
router.use("/auth", cors_website_only, router_auth);
router.use("/payments", router_payments);
router.use("/webhooks/stripe", router_stripe_webhooks);
router.use(
  "/applications",
  cors_website_only,
  authMiddleware,
  router_applications
);
router.use("/onboarding", cors_website_only, router_onboarding);

export default router;
