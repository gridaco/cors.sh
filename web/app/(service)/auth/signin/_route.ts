// LEGACY
import Axios from "axios";
import { encode_jwt, SECURE_BROWSER_COOKIE_AUTH_KEY } from "@/lib/auth";
import { NextResponse } from "next/server";

const authclient = Axios.create({
  baseURL: "https://accounts.services.grida.co",
});

// user signin with grida, retrieve oauth token from grida, sends it here,
// this service will check the token, if valid, it will generate a new token for the user,
// and send it back to the client with secure, http only cookie.
export async function POST(req: Request) {
  const authorization = req.headers.get("proxy-authorization");

  if (!authorization) {
    return NextResponse.json(
      { error: "no authorization header" },
      { status: 401 }
    );
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
    where: {
      // workspaceId: data.id,
    },
  });

  // sign customer (user) signature
  const jwt = encode_jwt(customer.id);

  // set secure cookie when authorized.
  NextResponse.json(
    {
      success: true,
      customer: customer,
    },
    {
      status: 200,
      headers: {
        "set-cookie": `${SECURE_BROWSER_COOKIE_AUTH_KEY}=${jwt}; Domain=.cors.sh; Path=/; Secure; HttpOnly; SameSite=Strict;`,
        // .cookie(SECURE_BROWSER_COOKIE_AUTH_KEY, jwt, {
        //   signed: true,
        //   domain: ".cors.sh",
        //   secure: true,
        //   httpOnly: true,
        //   sameSite: "strict",
        //   // no expiration. it is a secure cookie, that only has access to cors.sh. let's keep it this way for now.
        //   // expires: null
        // })
      },
    }
  );
}
