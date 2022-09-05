import { verify } from "./jwt";
import { Request, Response } from "express";
import { prisma } from "../clients";
import { SECURE_BROWSER_COOKIE_AUTH_KEY } from "./key";

// since the secure cookie cannot be forged, we have no additional validation on the jwt from client's secure http only cookie.
// the possible hacking scenario is..
// 1. the hacker steals the jwt secret (impossible, but somehow.)
// 2. the hacker finds out the customer id of services.cors.sh
// 3. the hacker sets the cookie with the jwt token, and the customer id.
// - seems secure enough for now.
export async function authMiddleware(req: Request, res: Response, next) {
  const authorization = req.signedCookies?.[SECURE_BROWSER_COOKIE_AUTH_KEY];
  if (!authorization) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const customerid = verify(authorization);
    const customer = await prisma.customer.findUnique({
      where: {
        id: customerid,
      },
    });

    res.locals.customer = customer;
  } catch (e) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
