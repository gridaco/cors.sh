import crypto from "crypto";
import day from "dayjs";
import jwt from "jsonwebtoken";

const API_KEY_TEMP_HASH_SECRET = process.env.API_KEY_TEMP_HASH_SECRET;
const API_KEY_TEST_HASH_SECRET = process.env.API_KEY_TEST_HASH_SECRET;
const API_KEY_LIVE_HASH_SECRET = process.env.API_KEY_LIVE_HASH_SECRET;

const API_KEY_HASH_SECRET_BY_TYPE = {
  test: API_KEY_TEST_HASH_SECRET,
  live: API_KEY_LIVE_HASH_SECRET,
  temp: API_KEY_TEMP_HASH_SECRET,
} as const;

interface PermanentKey {
  app_id: string;
  owner_id: string;
  type: "test" | "live";
}

interface TemporaryKey {
  email: string;
  type: "tmp";
  expires_at: number;
}

// shared db
interface ShardedApplicationAuhorizationTable {
  app_id: string;
  last_synced: number;
  plan: string;
}

const TMP_KEY_EXP_IN_DAYS = 1;
const TMP_KEY_PREFIX = "temp";
const TEST_KEY_PREFIX = "test";
const LIVE_KEY_PREFIX = "live";

function temp_key(email: string): TemporaryKey {
  return {
    email,
    type: "tmp",
    expires_at: day().add(TMP_KEY_EXP_IN_DAYS, "day").unix(),
  };
}

function test_key({
  app_id,
  owner_id,
}: {
  app_id: string;
  owner_id: string;
}): PermanentKey {
  return {
    app_id,
    owner_id,
    type: "test",
  };
}

function live_key({
  app_id,
  owner_id,
}: {
  app_id: string;
  owner_id: string;
}): PermanentKey {
  return {
    app_id,
    owner_id,
    type: "live",
  };
}

export function sign_temporary_key(email: string) {
  const payload = temp_key(email);
  return prefix("temp") + "_" + sign(payload, "temp");
}

export function sign_test_key(signature: { app_id: string; owner_id: string }) {
  return prefix("test") + "_" + sign(test_key(signature), "test");
}

export function sign_live_key(signature: { app_id: string; owner_id: string }) {
  return prefix("live") + "_" + sign(live_key(signature), "live");
}

//
// migrate this to cors.sh
export function validate_jwt(token: string) {
  if (token.startsWith(TMP_KEY_PREFIX)) {
    //
  } else if (token.startsWith(TEST_KEY_PREFIX)) {
    //
  } else if (token.startsWith(LIVE_KEY_PREFIX)) {
    //
  } else {
    throw "Invalid token format";
  }
}

function prefix(type: "test" | "live" | "temp") {
  switch (type) {
    case "test":
      return TEST_KEY_PREFIX;
    case "live":
      return LIVE_KEY_PREFIX;
    case "temp":
      return TMP_KEY_PREFIX;
  }
}

function sign(data: string | object, type: "test" | "live" | "temp") {
  const key = API_KEY_HASH_SECRET_BY_TYPE[type];
  const hmac = crypto.createHmac("sha256", key);
  hmac.update(JSON.stringify(data));
  return hmac.digest("hex");
}
