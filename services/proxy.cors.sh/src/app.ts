import * as express from "express";
import * as useragent from "express-useragent";
import * as corsProxy from "../lib/cors";
import * as responsetime from "response-time";

import { logRequest } from "./usage";
import { blaklistoriginlimit, payloadlimit } from "./limit";
import limiter from "./limit/rate-limit";
import { authorization } from "./auth";

const app = express();

const cors_proxy = corsProxy.createServer({
  originBlacklist: [],
  originWhitelist: [],
  requireHeader: ["origin", "x-requested-with"],
  checkRateLimit: null,
  removeHeaders: [
    "cookie",
    "cookie2",
    // Strip Heroku-specific headers
    "x-request-start",
    "x-request-id",
    "via",
    "connect-time",
    "total-route-time",
    // Other Heroku added debug headers
    // 'x-forwarded-for',
    // 'x-forwarded-proto',
    // 'x-forwarded-port',
  ],
  redirectSameOrigin: true,
  httpProxyOptions: {
    // Do not add X-Forwarded-For, etc. headers, because Heroku already adds it.
    xfwd: false,
  },
});

app.get("/", function (req, res) {
  res.redirect("https://cors.sh/");
});

app.use(blaklistoriginlimit); // 1
app.use(payloadlimit); // 2
app.use(authorization); // 3

// response time middleware
app.use(
  responsetime({
    suffix: false,
  }) as any
);

// user agent middleware
app.use(useragent.express());

// hourly rate limiter
app.use(limiter.hourly);

// monthly (28-day) rate limiter
app.use(limiter.monthly);

// -- execution order matters --
// (1)
app.use((req, res, next) => {
  if (res.headersSent) {
    return;
  }

  try {
    cors_proxy.emit("request", req, res);
    next();
  } catch (_) {}
});

// (2)
/**
 * after response middleware
 */
app.use((req, res) => {
  res.on("finish", () => {
    logRequest(req, res);
  });
});
// -- execution order matters --

/**
 * global error handler
 */
app.use(((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  try {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err,
      issue: "https://github.com/gridaco/cors.sh/issues",
    });
  } catch (_) {}
}) as express.ErrorRequestHandler);

export { app };
