import crypto from "crypto";
import { totp } from "otplib";
import day from "dayjs";

const API_KEY_TEMP_AES_SECRET = process.env.API_KEY_TEMP_AES_SECRET;
const API_KEY_TEMP_OTP_SECRET = process.env.API_KEY_TEMP_OTP_SECRET;
const API_KEY_TEST_HASH_SECRET = process.env.API_KEY_TEST_HASH_SECRET;
const API_KEY_LIVE_HASH_SECRET = process.env.API_KEY_LIVE_HASH_SECRET;

const API_KEY_HASH_SECRET_BY_TYPE = {
  test: API_KEY_TEST_HASH_SECRET,
  live: API_KEY_LIVE_HASH_SECRET,
  temp: API_KEY_TEMP_OTP_SECRET,
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

  totp.resetOptions();
  totp.options = {
    digits: 8,
    epoch: expires_at.unix() * 1000,
    step: 30,
    window: 1,
  };

  const otp = totp.generate(API_KEY_TEMP_OTP_SECRET);

  // convert to complex string with aes
  let cipher = crypto.createCipher("aes-256-cbc", API_KEY_TEMP_AES_SECRET);
  let encrypted = cipher.update(otp, "utf8", "hex") + cipher.final("hex");

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
  return prefix("test") + "_" + encrypt(test_key(signature), "test");
}

export function sign_live_key(signature: string) {
  return prefix("live") + "_" + encrypt(live_key(signature), "live");
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
