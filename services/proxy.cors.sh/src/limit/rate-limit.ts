import { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { createClient } from "redis";
import { validate_api_key } from "../auth/legacy/static-account-api-key-auth";
import {
  RATE_LIMIT_FREE_ANONYMOUS_PER_HOUR,
  RATE_LIMIT_FREE_AUTHORIZED_PER_HOUR,
  RATE_LIMIT_WINDOW_MS,
  STATIC_CORS_ACCOUNT_API_KEY_HEADERS,
  STATIC_CORS_ACCOUNT_API_KEY_HEADER_FOR_PAID_TIER,
} from "../k";
import { headerfrom } from "../_util/x-header";

// rather if locally ran by `sls offline`
const IS_OFFLINE = process.env.IS_OFFLINE;

const client = createClient({
  url: process.env.RATE_LIMIT_REDIS_URL,
  username: process.env.RATE_LIMIT_REDIS_USERNAME,
  password: process.env.RATE_LIMIT_REDIS_PASSWORD,
  socket: IS_OFFLINE
    ? {
        // 10 minutes
        connectTimeout: 10 * 60 * 1000,
        keepAlive: 10 * 60 * 1000,
      }
    : undefined,

  // ... (see https://github.com/redis/node-redis/blob/master/docs/client-configuration.md)
});

// TODO: make sure connected
client.connect();

// window
// if no api key
// 1. ip if localhost
// 2. host if not localhost
// with api key
// 1. 100 per hour if free tier
// 2. no limit if paid tier

const limiter = rateLimit({
  // Rate limiter configuration
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: (req: Request, res: Response) => {
    // the paid request will be skiped with `skip` configuration, set below only for free tier.
    const apikey = headerfrom(req.headers, STATIC_CORS_ACCOUNT_API_KEY_HEADERS);
    if (apikey && validate_api_key(apikey)) {
      // free & autorized
      return RATE_LIMIT_FREE_AUTHORIZED_PER_HOUR; // per hour
    }

    // anonymous (free)
    return RATE_LIMIT_FREE_ANONYMOUS_PER_HOUR; // per hour
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req: Request, res: Response) => {
    if (req.method == "OPTIONS" || req.method == "HEAD") {
      return true;
    }

    // tmp --------- remove this after applications are registered via console.
    // prettier-ignore
    const __maybe_paid_apikey = headerfrom(req.headers, STATIC_CORS_ACCOUNT_API_KEY_HEADER_FOR_PAID_TIER);
    if (__maybe_paid_apikey && validate_api_key(__maybe_paid_apikey)) {
      return true;
    }
    // end:tmp -----

    const _origin = req.headers["origin"];

    // if requested from cors.sh, skip rate limiting
    if (
      _origin === "https://cors.sh/playground" ||
      _origin === "https://cors.sh"
    ) {
      // don't rate limit for cors.sh (can this be forged?)
      return true;
    }

    return false;
  },
  keyGenerator: (req: Request, res: Response) => {
    const apikey = headerfrom(req.headers, STATIC_CORS_ACCOUNT_API_KEY_HEADERS);
    if (apikey && validate_api_key(apikey)) {
      // if using apikey, use the api key as key. (is this secure? - yes. is this the best way? - maybe, for now at least.)
      return apikey;
    }

    // if localhost, use ip.
    // if not localhost, use host.
    if (req.hostname == "localhost") {
      return req.ip;
    } else {
      return req.hostname;
    }

    // return ip by default
    return req.ip;
  },
  handler: (req: Request, res: Response, next) => {
    // 429 handler
    if (headerfrom(req.headers, STATIC_CORS_ACCOUNT_API_KEY_HEADERS)) {
      res
        .status(429)
        .send(
          "Too Many Requests.\nYou have reached the maximum number of requests per hour for Free tier. Please upgrade your plan to remove this limit."
        );
    } else {
      res
        .status(429)
        .send(
          "Too Many Requests.\nThis request is anonymous and rate limited. To upgrade, please add an api key at https://cors.sh"
        );
    }
  },
  // Redis store configuration
  store: new RedisStore({
    sendCommand: (...args: string[]) => client.sendCommand(args),
  }),
});

export default limiter;
