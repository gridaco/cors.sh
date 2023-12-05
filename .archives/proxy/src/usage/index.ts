import * as express from "express";
import * as dynamoose from "dynamoose";
import * as https from "https";
const agent = new https.Agent({
  keepAlive: true,
  rejectUnauthorized: true,
  maxSockets: 1000,
});

dynamoose.aws.sdk.config.update({
  httpOptions: {
    agent: agent,
  },
});

import {
  CorsProxyApiRequest,
  CorsProxyApiRequestLog,
  CorsRequestLogModel,
} from "./model";
import { nanoid } from "nanoid";
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
  await log({
    ip: ip,
    origin: origin,
    ua: ua,
    duration: duration,
    size: payload,
    at: timestamp,
    target: url,
    app: "anonymous",
  });
}

async function log(request: CorsProxyApiRequest) {
  // console.log("request", request);
  const id = nanoid();
  const billedduration = Math.ceil(request.duration / 100) * 100; // billed duration is stepped by 100ms
  try {
    const payload = new CorsRequestLogModel(<CorsProxyApiRequestLog>{
      id: id,
      billed_duration: billedduration,
      ...request,
    });

    await payload.save();
  } catch (_) {
    // do nothing
  }
}
