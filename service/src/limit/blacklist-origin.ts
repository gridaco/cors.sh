import * as express from "express";

/**
 * explicitly black listed origins. these are not registered to use base.
 */
const blacklisted_origin: string[] = [
  "REJECTME",
  // WAITING FOR SERVICE PROVIDER'S ACTION
  "titronline.org",
  "titr.online",
  "showsport.xyz",
  "cdn14.esp-cdn.xyz",
  "digi-hdsport.com",
  "siunus.github.io",
  // ILLEGAL OR AUDULT WEBSITE (PERMINANTLY BLOCKED)
  "twerktvnaija.com",
];

const blacked401UnAuthorized = (origin: string) => {
  return "https://bit.ly/2UnZSA8";
  // return {
  //   message: `CORS Proxy request from origin "${origin}" is not allowed. Request is unauthorized`,
  //   issue: "https://github.com/bridgedxyz/base/issues/23",
  // };
};

export const blaklistoriginlimit = (
  req: express.Request,
  res: express.Response,
  next
) => {
  const origin = req.headers["origin"];

  if (origin) {
    if (blacked(origin)) {
      res.status(401).send(blacked401UnAuthorized(origin));
      return;
    }
  }
  next();
};

function blacked(origin: string): boolean {
  // patterns
  // 1. www.<origin>
  // 2. http//<origin>
  // 3. https//<origin>
  // 4. http://<origin>
  // 5. ....
  try {
    const u = new URL(origin);
    return blacklisted_origin.some(o => {
      return u.hostname == o || u.hostname == "www." + o;
    });
  } catch (_) {
    // we cannot handle url that is invalid (need better logic for this)
    return false;
  }
}
