import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  /** Surface the DB user id (and tier) on the session for control-plane scoping. */
  interface Session {
    user: { id: string; tier?: string } & DefaultSession["user"];
  }
}
