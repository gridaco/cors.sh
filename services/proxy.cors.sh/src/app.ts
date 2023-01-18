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
  // https://github.com/Rob--W/cors-anywhere/issues/39
  requireHeader: ["origin", "x-requested-with"],
  // requireHeader: [],
  removeHeaders: [
    "cookie",
    "cookie2",
    "x-request-start",
    "x-request-id",
    "via",
    "connect-time",
    "total-route-time",
  ],
  redirectSameOrigin: true,
  httpProxyOptions: {
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
// (0)
app.use((req, res, next) => {
  // support 'x-strict-request-url'
  // refer issue: https://github.com/gridaco/cors.sh/issues/38
  const x_strict_request_url = req.headers["x-strict-request-url"];
  if (x_strict_request_url && typeof x_strict_request_url === "string") {
    // need prefix with '/' (required by cors_proxy to parse)
    req.url = "/" + x_strict_request_url;
    next();
    return;
  }

  next();
});

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
