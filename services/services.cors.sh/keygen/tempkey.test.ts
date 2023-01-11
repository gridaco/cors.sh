import { totp } from "otplib";
import { sign_temporary_key } from "./index";

const API_KEY_TEMP_HASH_SECRET = "API_KEY_TEMP_HASH_SECRET";

describe("", () => {
  const { key } = sign_temporary_key();
  const token = key.split("temp_")[1];

  console.log(token);

  totp.options = {
    digits: 8,
  };

  test("", async () => {
    const valid = totp.verify({
      token,
      secret: API_KEY_TEMP_HASH_SECRET,
    });
    expect(valid).toBe(true);
  });
});
