import * as express from "express";
import {
  getOnboardingApplication,
  createOnboardingApplication,
} from "../../controllers/applications";

const router = express.Router();

// create
router.post("/with-email", async (req, res) => {
  // create new temporary application bind to the email (form is optional)

  const { email } = req.body;

  // @requires: email
  if (!email) {
    return res.status(400).json({ error: "email is required" });
  }

  const d = await createOnboardingApplication({
    type: "with-email",
    email,
  });

  // send an email to the user
  // TODO:

  res.status(201).json(d);
});

router.post("/with-form", async (req, res) => {
  // create new temporary application bind to the form (email is optional)

  const { name, allowedOrigins, priceId } = req.body;

  const d = await createOnboardingApplication({
    type: "with-form",
    name,
    allowedOrigins,
    priceId,
  });

  res.status(201).json(d);
});

// conversion
router.post("/conversion", (req, res) => {
  const { onboarding_id, checkout_session_id } = req.body;
  //
  // if onboarding's email is placeholded. get email from checkout via stripe
});

router.get("/:id", async (req, res) => {
  // this route does not have a guard by design.
  // get onboarding application (only public data)
  const { id } = req.params;

  const d = await getOnboardingApplication(id);

  if (!d) {
    return res.status(404).json({ error: "application not found" });
  }

  res.status(200).json(d);
});

export default router;
