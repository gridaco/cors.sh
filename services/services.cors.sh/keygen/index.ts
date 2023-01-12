import crypto from "crypto";
import day from "dayjs";

const API_KEY_TEMP_AES_KEY = process.env.API_KEY_TEMP_AES_KEY;
const _aes_key = Buffer.from(API_KEY_TEMP_AES_KEY, "hex");
const API_KEY_TEMP_AES_IV: string = process.env.API_KEY_TEMP_AES_IV!;
const _aes_iv = Buffer.from(API_KEY_TEMP_AES_IV, "hex");

const API_KEY_TEST_HASH_SECRET = process.env.API_KEY_TEST_HASH_SECRET;
const API_KEY_LIVE_HASH_SECRET = process.env.API_KEY_LIVE_HASH_SECRET;

const API_KEY_HASH_SECRET_BY_TYPE = {
  test: API_KEY_TEST_HASH_SECRET,
  live: API_KEY_LIVE_HASH_SECRET,
} as const;

interface PermanentKey {
  signature: string;
  type: "test" | "live";
}

const TMP_KEY_PREFIX = "temp";
const TEST_KEY_PREFIX = "test";
const LIVE_KEY_PREFIX = "live";
const TMP_KEY_EXP_IN_DAYS = 3;

function test_key(signature: string): PermanentKey {
  return {
    signature,
    type: "test",
  };
}

function live_key(signature: string): PermanentKey {
  return {
    signature,
    type: "live",
  };
}

export function sign_temporary_key() {
  const expires_at = day().add(TMP_KEY_EXP_IN_DAYS, "day");

  const token = expires_at.unix().toString();

  // convert to complex string with aes
  let cipher = crypto.createCipheriv("aes-256-cbc", _aes_key, _aes_iv);

  // this may be considered as insecure. yes. it may be vulnerable to ciphertext attack,
  // even though it is fine because we have a rate-limit for temporary api keys and it does not have a clear usecase. for hackers to take benefits from this.
  let encrypted = cipher.update(token, "utf8", "hex") + cipher.final("hex");

  return {
    key: prefix("temp") + "_" + encrypted,
    expires_at,
  };
}

export function sign(signature: string, type: "test" | "live") {
  switch (type) {
    case "test":
      return sign_test_key(signature);
    case "live":
      return sign_live_key(signature);
  }
}

export function sign_test_key(signature: string) {
  const token = encrypt(test_key(signature), "test");
  return {
    key: prefix("test") + "_" + token,
    token,
  };
}

export function sign_live_key(signature: string) {
  const token = encrypt(live_key(signature), "live");

  return {
    key: prefix("live") + "_" + token,
    token,
  };
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

function encrypt(data: string | object, type: "test" | "live") {
  const key = API_KEY_HASH_SECRET_BY_TYPE[type];
  const hmac = crypto.createHmac("sha256", key);
  hmac.update(JSON.stringify(data));
  return hmac.digest("hex");
}
