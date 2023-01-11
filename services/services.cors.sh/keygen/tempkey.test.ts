import { totp } from "otplib";
import { sign_temporary_key } from "./index";

const API_KEY_TEMP_OTP_SECRET = "API_KEY_TEMP_OTP_SECRET";

describe("", () => {
  // const key = "temp_b5cb488e2fed4cf70355f814521fca97";
  const token = "41594019";

  // console.log(token);

  // decode it

  totp.options = {
    digits: 8,
  };

  test("", async () => {
    const valid = totp.verify({
      token,
      secret: API_KEY_TEMP_OTP_SECRET,
    });
    expect(valid).toBe(true);
  });
});
