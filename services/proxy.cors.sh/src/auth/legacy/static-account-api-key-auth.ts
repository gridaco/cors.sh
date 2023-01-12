import { keys } from "../_tmp_static_api_keys";

// const nokey401UnAuthorized = () => {
//   return "https://bit.ly/2UnZSA8";
//   // return {
//   //   message: `CORS Proxy request from origin "${origin}" is not allowed. Request is unauthorized`,
//   //   issue: "https://github.com/bridgedxyz/base/issues/23",
//   // };
// };

// export const unauthorizedAppBlocking = (
//   req: express.Request,
//   res: express.Response,
//   next
// ) => {
//   // skip api key check for preflight requests
//   if (req.method == "OPTIONS" || req.method == "HEAD") {
//     next();
//   }
//   const apikey = headerfrom(req.headers, STATIC_CORS_ACCOUNT_API_KEY_HEADERS);
//   if (apikey && validate_api_key(apikey)) {
//     next();
//   } else {
//     res.status(401).send(nokey401UnAuthorized());
//     return;
//   }
// };

export function validate_api_key(apikey: string) {
  if (!apikey || apikey == "") {
    return false;
  }
  const found = (keys as string[]).find((s) => s === apikey);
  if (found) {
    return true;
  }
  return false;
}
