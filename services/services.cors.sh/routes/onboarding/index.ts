import * as express from "express";
import { sign_temporary_key } from "../../keygen";
import { nanoid } from "nanoid";
import { prisma } from "../../clients";

const router = express.Router();

// create
router.post("/with-email", async (req, res) => {
  // create new temporary application bind to the email (form is optional)

  const { email, name, allowedOrigins } = req.body;

  // @requires: email
  if (!email) {
    return res.status(400).json({ error: "email is required" });
  }

  const d = await prisma.temporaryApplication.create({
    data: {
      key: sign_temporary_key(email),
      email: email,
      name: name,
      allowedOrigins: allowedOrigins ?? [],
    },
  });

  // send an email to the user
  // TODO:

  res.status(201).json({
    id: d.id,
    // omit the key since it also works as a verification code for faster signup
    // key: "omitted"
    email: d.email,
    name: d.name,
    allowedOrigins: d.allowedOrigins,
    priceId: d.priceId,
  });
});

router.post("/with-form", async (req, res) => {
  // create new temporary application bind to the form (email is optional)

  const { name, allowedOrigins, priceId } = req.body;
  const email = `${nanoid(10)}@unknown-users.cors.sh`;
  const d = await prisma.temporaryApplication.create({
    data: {
      key: sign_temporary_key(email),
      email,
      name,
      allowedOrigins: allowedOrigins ?? [],
      priceId,
    },
  });

  res.status(201).json(d);
});

// conversion
router.post("/conversion", (req, res) => {
  const { onboarding_id, checkout_session_id } = req.body;
  //
  // if onboarding's email is placeholded. get email from checkout via stripe
});

export default router;
