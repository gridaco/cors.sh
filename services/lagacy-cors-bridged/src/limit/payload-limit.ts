import * as https from "https";
import * as http from "http";
import { MB } from "../_util/size";

/**
 * this is to save data transfer cost. And basically we should not use CORS Proxy to load large files.
 *
 * https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html
 */
const MAX_TARGET_RESOURCE_MB = 2; // 6mb is max supported by api gateway. (supports up to 2mb on proxy)

export const payloadlimit = (req, res, next) => {
  const requrl = req.originalUrl.substring(1);

  const agent = requrl.startsWith("https:") ? https : http;
  agent
    .request(requrl, { method: "HEAD" }, _resp => {
      const len = Number(_resp.headers["content-length"]);
      if (len && len > MB * MAX_TARGET_RESOURCE_MB) {
        // reject if data larger than 30mb.
        res.status(413).send({
          message: `Requested resource exceeds ${MAX_TARGET_RESOURCE_MB}mb`,
          issue: "https://github.com/bridgedxyz/base/issues/23",
        });
      } else {
        // if content-length is undefined or less than 30mb, procceed.
        next();
      }
    })
    .on("error", err => {
      // ignore error for this
      // target, which is anonymous, might not support HEAD request.
      next();
    })
    .end();
};
