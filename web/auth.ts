import NextAuth, { type NextAuthResult } from "next-auth";
import Resend from "next-auth/providers/resend";
import { D1Adapter } from "@auth/d1-adapter";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { sendMagicLink, sendWelcome } from "@workspace/emails";

const MAGIC_LINK_TTL_SECONDS = 60 * 60; // 1 hour

// Per-request config: getCloudflareContext() must run in request scope so the D1 binding
// is available (proven in the Phase 0 spike). NextAuth v5 supports an async function config.
const result = NextAuth(async () => {
  const { env } = await getCloudflareContext({ async: true });
  return {
    adapter: D1Adapter(env.DB),
    session: { strategy: "database" as const },
    pages: { signIn: "/login" },
    secret: env.AUTH_SECRET,
    trustHost: true,
    providers: [
      Resend({
        apiKey: env.RESEND_API_KEY ?? "re_dryrun",
        from: env.EMAIL_FROM ?? "cors.sh <noreply@cors.sh>",
        maxAge: MAGIC_LINK_TTL_SECONDS,
        // Send via our branded template (dry-run aware) instead of the provider default.
        async sendVerificationRequest({ identifier, url }) {
          await sendMagicLink(env, identifier, {
            url,
            host: new URL(url).host,
            expiresMinutes: MAGIC_LINK_TTL_SECONDS / 60,
          });
        },
      }),
    ],
    callbacks: {
      // Database sessions don't surface the user id/tier by default — add them so
      // route handlers can scope by `session.user.id` and read entitlement.
      session({ session, user }) {
        if (session.user) {
          session.user.id = user.id;
          session.user.tier = (user as { tier?: string }).tier ?? "free";
        }
        return session;
      },
    },
    events: {
      // Fires once, the first time a user row is created.
      async createUser({ user }) {
        if (user.email) await sendWelcome(env, user.email, { name: user.name ?? undefined });
      },
    },
  };
});

// Explicit annotations: next-auth v5's inferred signIn/signOut types reference a
// non-portable `ProviderId`, which trips TS2742 under the app's type-check. Naming them
// via NextAuthResult keeps the exports portable.
export const handlers: NextAuthResult["handlers"] = result.handlers;
export const signIn: NextAuthResult["signIn"] = result.signIn;
export const signOut: NextAuthResult["signOut"] = result.signOut;
export const auth: NextAuthResult["auth"] = result.auth;
