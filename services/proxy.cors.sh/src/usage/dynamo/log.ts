import type { CorsProxyApiRequest, CorsProxyApiRequestLog } from "../type";
import { CorsRequestLogModel } from "./model";
import { nanoid } from "nanoid";
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

async function log(
  request: CorsProxyApiRequest & {
    billed_duration: number;
  }
) {
  // console.log("request", request);
  const id = nanoid();
  try {
    const payload = new CorsRequestLogModel(<CorsProxyApiRequestLog>{
      id: id,
      ...request,
    });

    await payload.save();
  } catch (_) {
    // do nothing
  }
}
