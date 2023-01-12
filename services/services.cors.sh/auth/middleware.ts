import { verify } from "./jwt";
import { Request, Response } from "express";
import { prisma, stripe } from "../clients";
import { SECURE_BROWSER_COOKIE_AUTH_KEY } from "./key";

// since the secure cookie cannot be forged, we have no additional validation on the jwt from client's secure http only cookie.
// the possible hacking scenario is..
// 1. the hacker steals the jwt secret (impossible, but somehow.)
// 2. the hacker finds out the customer id of services.cors.sh
// 3. the hacker sets the cookie with the jwt token, and the customer id.
// - seems secure enough for now.
export async function authMiddleware(req: Request, res: Response, next) {
  const _1 = await standardAuthorizer(req);
  if (_1) {
    const { customer } = _1;
    res.locals.customer = customer;
    next();
    return;
  }

  const _2 = await checoutSessionAuthorizer(req);
  if (_2) {
    const { customer } = _2;
    res.locals.customer = customer;
    next();
    return;
  }

  return res.status(401).json({ error: "Unauthorized" });
}

async function checoutSessionAuthorizer(req: Request) {
  const checkout_session_id = req.headers["x-cors-service-checkout-session-id"];
  if (!checkout_session_id) {
    return false;
  }

  const checkout_session = await stripe.checkout.sessions.retrieve(
    checkout_session_id as string
  );

  const { customer: stripe_customer_id } = checkout_session;

  const customer = await prisma.customer.findUnique({
    where: {
      stripeId: stripe_customer_id as string,
    },
  });

  if (!customer) {
    return false;
  }

  return {
    customer,
  };
}

async function standardAuthorizer(req: Request): Promise<false | { customer }> {
  const authorization = req.signedCookies?.[SECURE_BROWSER_COOKIE_AUTH_KEY];
  if (!authorization) {
    return false;
  }

  try {
    const customerid = verify(authorization);
    const customer = await prisma.customer.findUnique({
      where: {
        id: customerid,
      },
    });

    return {
      customer,
    };
  } catch (e) {
    return false;
  }
}
