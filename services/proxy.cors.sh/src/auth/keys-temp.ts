import * as crypto from "crypto";
import * as day from "dayjs";

const API_KEY_TEMP_AES_KEY: string = process.env.API_KEY_TEMP_AES_KEY!;
const API_KEY_TEMP_AES_IV: string = process.env.API_KEY_TEMP_AES_IV!;
const _aes_key = Buffer.from(API_KEY_TEMP_AES_KEY, "hex");
const _aes_iv = Buffer.from(API_KEY_TEMP_AES_IV, "hex");
const TMP_KEY_EXP_IN_DAYS = 3;

export function validate_tmp_key(signature: string) {
  // decode signature that uses aes-256-cbc, then validate with totp.
  let decipher = crypto.createDecipheriv("aes-256-cbc", _aes_key, _aes_iv);

  try {
    let token =
      decipher.update(signature, "hex", "utf8") + decipher.final("utf8");

    // token is a unix timestamp
    // the token should match (now ~ now + TMP_KEY_EXP_IN_DAYS)
    const now = day();
    const token_day = day.unix(Number(token));
    const diff = token_day.diff(now, "day");

    if (diff > TMP_KEY_EXP_IN_DAYS) {
      return false;
    }

    return true;
  } catch (e) {
    return false;
  }
}
