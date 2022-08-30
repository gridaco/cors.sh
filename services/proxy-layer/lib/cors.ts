import * as httpProxy from "http-proxy";
import * as https from "https";
import * as http from "http";
import * as url from "url";
import { getProxyForUrl } from "proxy-from-env";
import { withCORS, isValidHostName, parseURL } from "./utils";

interface OptionParams {
  httpProxyOptions: httpProxy.ServerOptions;
  httpsOptions?: https.ServerOptions;
  [x: string]: any;
}

function proxyRequest(req, res, proxy) {
  var location = req.corsAnywhereRequestState.location;
  req.url = location.path;

  var proxyOptions: any = {
    changeOrigin: false,
    prependPath: false,
    target: location,
    headers: {
      host: location.host,
    },
    buffer: {
      pipe: function(proxyReq) {
        var proxyReqOn = proxyReq.on;
        proxyReq.on = function(eventName, listener) {
          if (eventName !== "response") {
            return proxyReqOn.call(this, eventName, listener);
          }
          return proxyReqOn.call(this, "response", function(proxyRes) {
            if (onProxyResponse(proxy, proxyReq, proxyRes, req, res)) {
              try {
                listener(proxyRes);
              } catch (err) {
                proxyReq.emit("error", err);
              }
            }
          });
        };
        return req.pipe(proxyReq);
      },
    },
  };

  var proxyThroughUrl = req.corsAnywhereRequestState.getProxyForUrl(
    location.href
  );
  if (proxyThroughUrl) {
    proxyOptions.target = proxyThroughUrl;
    proxyOptions.toProxy = true;
    req.url = location.href;
  }

  try {
    proxy.web(req, res, proxyOptions);
  } catch (err) {
    proxy.emit("error", err, req, res);
  }
}

function onProxyResponse(proxy, proxyReq, proxyRes, req, res) {
  var requestState = req.corsAnywhereRequestState;

  var statusCode = proxyRes.statusCode;

  if (!requestState.redirectCount_) {
    res.setHeader("x-request-url", requestState.location.href);
  }
  if (
    statusCode === 301 ||
    statusCode === 302 ||
    statusCode === 303 ||
    statusCode === 307 ||
    statusCode === 308
  ) {
    var locationHeader = proxyRes.headers.location;
    var parsedLocation;
    if (locationHeader) {
      locationHeader = url.resolve(requestState.location.href, locationHeader);
      parsedLocation = parseURL(locationHeader);
    }
    if (parsedLocation) {
      if (statusCode === 301 || statusCode === 302 || statusCode === 303) {
        requestState.redirectCount_ = requestState.redirectCount_ + 1 || 1;
        if (requestState.redirectCount_ <= requestState.maxRedirects) {
          res.setHeader(
            "X-CORS-Redirect-" + requestState.redirectCount_,
            statusCode + " " + locationHeader
          );

          req.method = "GET";
          req.headers["content-length"] = "0";
          delete req.headers["content-type"];
          requestState.location = parsedLocation;
          req.removeAllListeners();
          proxyReq.removeAllListeners("error");
          proxyReq.once("error", function catchAndIgnoreError() {});
          proxyReq.abort();
          proxyRequest(req, res, proxy);
          return false;
        }
      }
      proxyRes.headers.location =
        requestState.proxyBaseUrl + "/" + locationHeader;
    }
  }

  delete proxyRes.headers["set-cookie"];
  delete proxyRes.headers["set-cookie2"];

  proxyRes.headers["x-final-url"] = requestState.location.href;
  withCORS(proxyRes.headers, req);
  return true;
}

function getHandler(options, proxy) {
  var corsAnywhere: any = {
    getProxyForUrl: getProxyForUrl, // Function that specifies the proxy to use
    maxRedirects: 5, // Maximum number of redirects to be followed.
    originBlacklist: [], // Requests from these origins will be blocked.
    originWhitelist: [], // If non-empty, requests not from an origin in this list will be blocked.
    checkRateLimit: null, // Function that may enforce a rate-limit by returning a non-empty string.
    redirectSameOrigin: false, // Redirect the client to the requested URL for same-origin requests.
    requireHeader: null, // Require a header to be set?
    removeHeaders: [], // Strip these request headers.
    setHeaders: {}, // Set these request headers.
    corsMaxAge: 0, // If set, an Access-Control-Max-Age header with this value (in seconds) will be added.
    helpFile: __dirname + "/help.txt",
  };

  Object.keys(corsAnywhere).forEach(function(option) {
    if (Object.prototype.hasOwnProperty.call(options, option)) {
      corsAnywhere[option] = options[option];
    }
  });
  if (corsAnywhere.requireHeader) {
    if (typeof corsAnywhere.requireHeader === "string") {
      corsAnywhere.requireHeader = [corsAnywhere.requireHeader.toLowerCase()];
    } else if (
      !Array.isArray(corsAnywhere.requireHeader) ||
      corsAnywhere.requireHeader.length === 0
    ) {
      corsAnywhere.requireHeader = null;
    } else {
      corsAnywhere.requireHeader = corsAnywhere.requireHeader.map(function(
        headerName
      ) {
        return headerName.toLowerCase();
      });
    }
  }
  var hasRequiredHeaders = function(headers) {
    return (
      !corsAnywhere.requireHeader ||
      corsAnywhere.requireHeader.some(function(headerName) {
        return Object.hasOwnProperty.call(headers, headerName);
      })
    );
  };

  return function(req, res) {
    req.corsAnywhereRequestState = {
      getProxyForUrl: corsAnywhere.getProxyForUrl,
      maxRedirects: corsAnywhere.maxRedirects,
      corsMaxAge: corsAnywhere.corsMaxAge,
    };

    var cors_headers = withCORS({}, req);
    if (req.method === "OPTIONS") {
      res.writeHead(200, cors_headers);
      res.end();
      return;
    }

    var location: any = parseURL(req.url.slice(1));

    if (location.host === "iscorsneeded") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("no");
      return;
    }

    if (location.port > 65535) {
      res.writeHead(400, "Invalid port", cors_headers);
      res.end("Port number too large: " + location.port);
      return;
    }

    if (!/^\/https?:/.test(req.url) && !isValidHostName(location.hostname)) {
      res.writeHead(404, "Invalid host", cors_headers);
      res.end("Invalid host: " + location.hostname);
      return;
    }

    if (!hasRequiredHeaders(req.headers)) {
      res.writeHead(400, "Header required", cors_headers);
      res.end(
        "Missing required request header. Must specify one of: " +
          corsAnywhere.requireHeader
      );
      return;
    }

    var origin = req.headers.origin || "";
    if (corsAnywhere.originBlacklist.indexOf(origin) >= 0) {
      res.writeHead(403, "Forbidden", cors_headers);
      res.end(
        'The origin "' +
          origin +
          '" was blacklisted by the operator of this proxy.'
      );
      return;
    }

    if (
      corsAnywhere.originWhitelist.length &&
      corsAnywhere.originWhitelist.indexOf(origin) === -1
    ) {
      res.writeHead(403, "Forbidden", cors_headers);
      res.end(
        'The origin "' +
          origin +
          '" was not whitelisted by the operator of this proxy.'
      );
      return;
    }

    var rateLimitMessage =
      corsAnywhere.checkRateLimit && corsAnywhere.checkRateLimit(origin);
    if (rateLimitMessage) {
      res.writeHead(429, "Too Many Requests", cors_headers);
      res.end(
        'The origin "' +
          origin +
          '" has sent too many requests.\n' +
          rateLimitMessage
      );
      return;
    }

    if (
      corsAnywhere.redirectSameOrigin &&
      origin &&
      location.href[origin.length] === "/" &&
      location.href.lastIndexOf(origin, 0) === 0
    ) {
      cors_headers.vary = "origin";
      cors_headers["cache-control"] = "private";
      cors_headers.location = location.href;
      res.writeHead(301, "Please use a direct request", cors_headers);
      res.end();
      return;
    }

    var isRequestedOverHttps =
      req.connection.encrypted ||
      /^\s*https/.test(req.headers["x-forwarded-proto"]);
    var proxyBaseUrl =
      (isRequestedOverHttps ? "https://" : "http://") + req.headers.host;

    corsAnywhere.removeHeaders.forEach(function(header) {
      delete req.headers[header];
    });

    Object.keys(corsAnywhere.setHeaders).forEach(function(header) {
      req.headers[header] = corsAnywhere.setHeaders[header];
    });

    req.corsAnywhereRequestState.location = location;
    req.corsAnywhereRequestState.proxyBaseUrl = proxyBaseUrl;

    proxyRequest(req, res, proxy);
  };
}

export const createServer = (options: OptionParams) => {
  var server: https.Server | http.Server;
  var httpProxyOptions: httpProxy.ServerOptions = {
    xfwd: true, // Append X-Forwarded-* headers
  };

  options = options || {};

  if (options.httpProxyOptions) {
    Object.keys(options.httpProxyOptions).forEach(function(option) {
      httpProxyOptions[option] = options.httpProxyOptions[option];
    });
  }

  var proxy: httpProxy = httpProxy.createServer(httpProxyOptions);
  var requestHandler = getHandler(options, proxy);
  if (options.httpsOptions) {
    server = https.createServer(options.httpsOptions, requestHandler);
  } else {
    server = http.createServer(requestHandler);
  }

  proxy.on("error", function(
    err: Error,
    _: http.IncomingMessage,
    res: http.ServerResponse
  ) {
    if (res.headersSent) {
      if (res.writableEnded === false) {
        res.end();
      }
      return;
    }
    var headerNames = res.getHeaderNames
      ? res.getHeaderNames()
      : //@ts-ignore
        Object.keys(res._headers || {});
    headerNames.forEach(function(name) {
      res.removeHeader(name);
    });

    res.writeHead(404, { "Access-Control-Allow-Origin": "*" });
    res.end("Not found because of proxy error: " + err);
  });
  return server;
};
