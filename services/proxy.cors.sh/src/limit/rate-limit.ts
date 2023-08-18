import { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { createClient } from "redis";
import {
  RATE_LIMIT_FREE_ANONYMOUS_PER_HOUR,
  RATE_LIMIT_FREE_AUTHORIZED_PER_HOUR,
  RATE_LIMIT_PAID_PER_MONTH_DEFAULT,
  RATE_LIMIT_PAID_PER_MONTH_T1,
  RATE_LIMIT_PAID_PER_MONTH_T2,
} from "../k";
import type { AuthorizationInfo } from "../auth";

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

/**
 * shared for all rate limiters
 * @returns
 */
const keygenerator = (req: Request, res: Response) => {
  const { id } = (res.locals.authorization as AuthorizationInfo) ?? {};
  // return ip by default
  return id || req.ip;
};

/**
 * 429 handler
 * Used by all rate limiters
 */
const excess_handler = (req: Request, res: Response, next) => {
  const { authorized } = (res.locals.authorization as AuthorizationInfo) ?? {};
  // 429 handler
  if (authorized) {
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
};

const limiter_free_per_hour = rateLimit({
  // Rate limiter configuration
  windowMs: 60 * 1000 * 60, // 1 hour
  max: (req: Request, res: Response) => {
    const { tier } = (res.locals.authorization as AuthorizationInfo) ?? {};

    switch (tier) {
      case "unlimited":
        return Infinity;
      case "free":
        return RATE_LIMIT_FREE_AUTHORIZED_PER_HOUR; // per hour
      case "anonymous":
        return RATE_LIMIT_FREE_ANONYMOUS_PER_HOUR; // per hour
      case "2022.t1":
        // legacy, all free version
        return RATE_LIMIT_FREE_AUTHORIZED_PER_HOUR; // per hour
      case "2023.t1":
      case "2023.t2": {
        // paid version
        // no limit, passed by skip()
        return Infinity;
      }
      default:
        // anonymous (free)
        return RATE_LIMIT_FREE_ANONYMOUS_PER_HOUR; // per hour
    }
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req: Request, res: Response) => {
    if (req.method == "OPTIONS" || req.method == "HEAD") {
      return true;
    }

    let force_skip = false;

    const { skip_rate_limit, tier } =
      (res.locals.authorization as AuthorizationInfo) ?? {};

    if (tier === "2023.t1" || tier === "2023.t2") {
      // since no monthly limit, skip the hourly limit for paid version
      force_skip = true;
    }

    if (force_skip || skip_rate_limit) {
      return true;
    }

    res.locals.rate_limit_handled = true;
    return false;
  },
  keyGenerator: keygenerator,
  handler: excess_handler,
  // Redis store configuration
  store: new RedisStore({
    sendCommand: (...args: string[]) => client.sendCommand(args),
  }),
});

const MONTH28MS = 60 * 1000 * 60 * 24 * 28; // 28 days in ms

// Consider: monthly rate limit might require bigger redis instance
const limiter_paid_per_month = rateLimit({
  // 28-day month
  windowMs: MONTH28MS,
  // max: RATE_LIMIT_PAID_PER_MONTH_T1,
  max: (req: Request, res: Response) => {
    const { tier } = (res.locals.authorization as AuthorizationInfo) ?? {};

    switch (tier) {
      case "2023.t1": {
        // paid version tier 1 ($4 / Mo)
        return RATE_LIMIT_PAID_PER_MONTH_T1;
      }
      case "2023.t2": {
        // paid version tier 2 ($20 / Mo)
        return RATE_LIMIT_PAID_PER_MONTH_T2;
      }
      case "unlimited":
        return Infinity;
      case "anonymous": // anon, blocked by hourly limiter anyway
      case "free": // free, blocked by hourly limiter anyway
      case "2022.t1": // legacy, all free version
      default:
        // anonymous (free)
        return RATE_LIMIT_PAID_PER_MONTH_DEFAULT; // per month
    }
  },
  skip: (req: Request, res: Response) => {
    if (req.method == "OPTIONS" || req.method == "HEAD") {
      return true;
    }

    // if rate limit handled by hourly limiter, skip this one
    return res.locals.rate_limit_handled;
  },
  keyGenerator: keygenerator,
  handler: excess_handler,
  store: new RedisStore({
    sendCommand: (...args: string[]) => client.sendCommand(args),
  }),
});

// FIXME: - We have to merge the two limiters into one - seems the skip does not do what we thought it does (It always uses the hourly limiter. even for paid plan, causing it to be infinite)
export default {
  hourly: limiter_free_per_hour,
  monthly: limiter_paid_per_month,
};
