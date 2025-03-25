import * as express from "express";
import Axios from "axios";
import { prisma } from "../../clients";
import { encode_jwt, SECURE_BROWSER_COOKIE_AUTH_KEY } from "../../auth";

const router = express.Router();

const authclient = Axios.create({
  baseURL: "https://accounts.services.grida.co",
});

// user signin with grida, retrieve oauth token from grida, sends it here,
// this service will check the token, if valid, it will generate a new token for the user,
// and send it back to the client with secure, http only cookie.
router.post("signin", async (req, res) => {
  const authorization = req.headers["proxy-authorization"];
  if (!authorization) {
    res.status(401).json({ error: "no authorization header" });
    return;
  }

  // authenticate via accounts.grida.co
  // request auth server for authentication.
  const { data } = await authclient.get("/verify", {
    headers: {
      // proxy the header, in form of "Bearer <token>"
      authorization,
    },
  });

  const customer = await prisma.customer.findUnique({
    // @ts-ignore
    where: {
      // workspaceId: data.id,
    },
  });

  // sign customer (user) signature
  const jwt = encode_jwt(customer.id);

  // set secure cookie when authorized.
  res
    .cookie(SECURE_BROWSER_COOKIE_AUTH_KEY, jwt, {
      signed: true,
      domain: ".cors.sh",
      secure: true,
      httpOnly: true,
      sameSite: "strict",
      // no expiration. it is a secure cookie, that only has access to cors.sh. let's keep it this way for now.
      // expires: null
    })
    .json({
      success: true,
      customer: customer,
    });
});

export default router;
