import * as express from "express";
import type { CorsProxyApiRequestLog } from "./type";

type Log = Omit<CorsProxyApiRequestLog, "id">;

/**
 *
 * @param req
 * @param res
 */
export async function logRequest(req: express.Request, res: express.Response) {
  // do not log the request if client error. (413 or 401 or 400)
  if (500 > res.statusCode && res.statusCode >= 400) {
    return;
  }
  const ip = (req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress) as string;
  const timestamp = new Date();
  const origin = req.headers["origin"] || undefined;
  //@ts-ignore (useragent is provided by above useragent.express())
  const _uaobj = req.useragent;
  const ua = _uaobj.source; // gives the raw ua string
  const url = res.get("x-request-url");
  const payload = Number(
    (() => {
      const _cl = res.get("content-length");
      return _cl ? _cl : 0;
    })()
  );
  const duration = Number(
    (() => {
      const _rt = res.get("x-response-time");
      return _rt ? _rt : 0;
    })()
  );

  const billed_duration = Math.ceil(duration / 100) * 100; // billed duration is stepped by 100ms
  // request id from api gateway
  // const request_id = req.headers["x-request-id"] as string;

  const metric: Log = {
    ip: ip,
    origin: origin,
    ua: ua,
    duration: duration,
    size: payload,
    at: timestamp,
    target: url,
    app: "anonymous",
    billed_duration,
  };

  systemlog(metric);
  // await log(metric);
}

function systemlog(request: Log) {
  console.log(request);
}
