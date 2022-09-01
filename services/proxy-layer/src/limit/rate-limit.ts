import { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { createClient } from "redis";
import { validate_api_key } from "../auth/static-account-api-key-auth";
import {
  RATE_LIMIT_FREE_ANONYMOUS_PER_HOUR,
  RATE_LIMIT_FREE_AUTHORIZED_PER_HOUR,
  RATE_LIMIT_WINDOW_MS,
  STATIC_CORS_ACCOUNT_API_KEY_HEADER,
} from "../k";

const client = createClient({
  url: process.env.RATE_LIMIT_REDIS_URL,
  username: process.env.RATE_LIMIT_REDIS_USERNAME,
  password: process.env.RATE_LIMIT_REDIS_PASSWORD,

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
    const apikey: string = req.headers[
      STATIC_CORS_ACCOUNT_API_KEY_HEADER
    ] as string;
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
    if (req.headers[STATIC_CORS_ACCOUNT_API_KEY_HEADER]) {
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
