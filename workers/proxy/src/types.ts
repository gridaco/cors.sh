export type KeyType = "live" | "test";

/** The projection the hot path needs to authorize + meter a request (PRD §4.3). */
export interface KeyRecord {
  account: string;
  tier: string;
  keyType: KeyType;
  /** exact-match origins (PRD §4.6). live keys are pinned to these; test keys ignore them. */
  allowedOrigins: string[];
  /** allowed upstream hosts; empty = any. */
  allowedTargets: string[];
  quota?: { requests: number; bytes: number };
  active?: boolean; // false => revoked
  validUntil?: number; // unix seconds
}

/** Minimal KV binding surface (avoids a hard dep on @cloudflare/workers-types for now). */
export interface KVNamespaceLike {
  get(key: string, options: { type: "json" }): Promise<unknown>;
  get(key: string): Promise<string | null>;
}

// Minimal D1 surface for usage/quota.
export interface D1Result<T = unknown> {
  results: T[];
  success: boolean;
}
export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  run(): Promise<D1Result>;
}
export interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

/** Minimal Durable Object surface (avoids a hard dep on @cloudflare/workers-types). */
export interface DurableObjectStub {
  fetch(input: string | Request): Promise<Response>;
}
export interface DurableObjectNamespace {
  idFromName(name: string): unknown;
  get(id: unknown): DurableObjectStub;
}

export interface Env {
  /** key -> KeyRecord projection (PRD §4.3). Bound to the `cors-keys` namespace. */
  KEYS: KVNamespaceLike;
  /** control DB (shared with the control plane) — usage + quota. */
  DB: D1Database;
  /** exact per-key rate limiter for test keys — Durable Object (SPEC §4). */
  RATE_LIMITER: DurableObjectNamespace;
  /** control-plane (web) base URL for best-effort quota-notification pings (optional). */
  WEB_INTERNAL_URL?: string;
  INTERNAL_SECRET?: string;
}

/** Minimal execution-context shape (avoids a hard dep on @cloudflare/workers-types for now). */
export interface Ctx {
  waitUntil(promise: Promise<unknown>): void;
}

export interface AuthError {
  status: number;
  body: string;
}
