import * as express from "express";
import * as useragent from "express-useragent";
import * as corsProxy from "../lib/cors";
import * as responsetime from "response-time";

import { logRequest } from "./usage";
import { blaklistoriginlimit, payloadlimit } from "./limit";
import { unauthorizedAppBlocking } from "./auth";

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

app.get("/", function(req, res) {
  res.redirect("https://app.cors.bridged.cc/");
});

app.use(blaklistoriginlimit); // 1
app.use(payloadlimit); // 2
app.use(unauthorizedAppBlocking); // 3

app.use(
  responsetime({
    suffix: false,
  })
);
app.use(useragent.express());

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
    return;
  }
  try {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err,
      issue: "https://github.com/bridgedxyz/base/issues",
    });
  } catch (_) {}
}) as express.ErrorRequestHandler);

export { app };
