import { totp } from "otplib";
import crypto from "crypto";

const API_KEY_TEMP_AES_SECRET: string = process.env.API_KEY_TEMP_AES_SECRET!;
const API_KEY_TEMP_OTP_SECRET: string = process.env.API_KEY_TEMP_OTP_SECRET!;


async function validate_tmp_key(signature: string) {
  // decode signature that uses aes-256-cbc, then validate with totp.
  let decipher = crypto.createDecipher("aes-256-cbc", API_KEY_TEMP_AES_SECRET);
  let otp = decipher.update(signature, "hex", "utf8") + decipher.final("utf8");

  return totp.verify({ token: otp, secret: API_KEY_TEMP_OTP_SECRET });
}
