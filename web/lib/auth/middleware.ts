// import { verify } from "./jwt";
// import { SECURE_BROWSER_COOKIE_AUTH_KEY } from "./key";
import { stripe } from "../clients";
import { supabase } from "../supabase";
import { NextResponse } from "next/server";
import { createServerClient, CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

// since the secure cookie cannot be forged, we have no additional validation on the jwt from client's secure http only cookie.
// the possible hacking scenario is..
// 1. the hacker steals the jwt secret (impossible, but somehow.)
// 2. the hacker finds out the customer id of services.cors.sh
// 3. the hacker sets the cookie with the jwt token, and the customer id.
// - seems secure enough for now.
export async function authMiddleware(req: Request, res: Response) {
  const _1 = await standardAuthorizer(req);
  if (_1) {
    const { customer } = _1;
    res.headers.set("x-cors-service-customer-id", String(customer.id));
    return res;
  }

  const _2 = await checoutSessionAuthorizer(req);
  if (_2) {
    const { customer } = _2;
    res.headers.set("x-cors-service-customer-id", String(customer.id));
    return res;
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

async function checoutSessionAuthorizer(req: Request) {
  const checkout_session_id = req.headers.get(
    "x-cors-service-checkout-session-id"
  );
  if (!checkout_session_id) {
    return false;
  }

  const checkout_session = await stripe.checkout.sessions.retrieve(
    checkout_session_id as string
  );

  const { customer: stripe_customer_id } = checkout_session;

  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("stripe_id", stripe_customer_id as string)
    .single();

  if (!customer) {
    return false;
  }

  return {
    customer,
  };
}

async function standardAuthorizer(req: Request): Promise<false | { customer }> {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    return false
  }

  // TODO: fetch customer
  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("id", user.id)
    .single();
  if (!customer) {
    return false
  }

  return customer
}
