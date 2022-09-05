import day from "dayjs";
import jwt from "jsonwebtoken";

interface PermanentKey {
  app_id: string;
  type: "test" | "live";
}

interface TemporaryKey {
  /**
   * use email address as app_id
   */
  app_id: string;
  email: string;
  type: "temporary";
  expires_at: string;
}

// shared db
interface ShardedApplicationAuhorizationTable {
  app_id: string;
  last_synced: number;
  plan: string;
}

export function temporary_key(email: string): TemporaryKey {
  return {
    app_id: email,
    email,
    type: "temporary",
    expires_at: day().add(1, "day").toISOString(),
  };
}

const TMP_KEY_EXP_IN = "1d";
const TMP_KEY_PREFIX = "tmp";
const TEST_KEY_PREFIX = "test";
const LIVE_KEY_PREFIX = "live";

export function sign_temporary_key(email: string) {
  const payload = temporary_key(email);
  return (
    TMP_KEY_PREFIX +
    "_" +
    jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: TMP_KEY_EXP_IN,
    })
  );
}

export function test_key(appid: string): PermanentKey {
  return {
    app_id: appid,
    type: "test",
  };
}

export function live_key(appid: string): PermanentKey {
  return {
    app_id: appid,
    type: "live",
  };
}

export function sign_test_key(appid: string) {
  return (
    TEST_KEY_PREFIX + "_" + jwt.sign(test_key(appid), process.env.JWT_SECRET)
  );
}

export function sign_live_key(appid: string) {
  return (
    LIVE_KEY_PREFIX + "_" + jwt.sign(live_key(appid), process.env.JWT_SECRET)
  );
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
