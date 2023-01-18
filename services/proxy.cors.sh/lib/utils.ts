import * as net from "net";
import * as url from "url";
const regexp_tld = require("./regexp-top-level-domain");

/**
 * Adds CORS headers to the response headers.
 *
 * @param headers {object} Response headers
 * @param request {ServerRequest}
 */
export function withCORS(headers, request) {
  headers["access-control-allow-origin"] = "*";
  var corsMaxAge = request.corsAnywhereRequestState.corsMaxAge;
  if (request.method === "OPTIONS" && corsMaxAge) {
    headers["access-control-max-age"] = corsMaxAge;
  }
  if (request.headers["access-control-request-method"]) {
    headers["access-control-allow-methods"] =
      request.headers["access-control-request-method"];
    delete request.headers["access-control-request-method"];
  }
  if (request.headers["access-control-request-headers"]) {
    headers["access-control-allow-headers"] =
      request.headers["access-control-request-headers"];
    delete request.headers["access-control-request-headers"];
  }

  headers["access-control-expose-headers"] = Object.keys(headers).join(",");

  return headers;
}

/**
 * Check whether the specified hostname is valid.
 *
 * @param hostname {string} Host name (excluding port) of requested resource.
 * @return {boolean} Whether the requested resource can be accessed.
 */
export function isValidHostName(hostname) {
  return !!(
    regexp_tld.test(hostname) ||
    net.isIPv4(hostname) ||
    net.isIPv6(hostname)
  );
}

/**
 * @param req_url {string} The requested URL (scheme is optional).
 * @return {object} URL parsed using url.parse
 * @origin https://github.com/Rob--W/cors-anywhere/blob/master/lib/cors-anywhere.js
 */
export function parseURL(req_url) {
  // prettier-ignore
  var match = req_url.match(/^(?:(https?:)?\/\/)?(([^\/?]+?)(?::(\d{0,5})(?=[\/?]|$))?)([\/?][\S\s]*|$)/i);
  //                              ^^^^^^^          ^^^^^^^^      ^^^^^^^                ^^^^^^^^^^^^
  //                            1:protocol       3:hostname     4:port                 5:path + query string
  //                                              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  //                                            2:host
  if (!match) {
    return null;
  }
  if (!match[1]) {
    if (/^https?:/i.test(req_url)) {
      // The pattern at top could mistakenly parse "http:///" as host="http:" and path=///.
      return null;
    }
    // Scheme is omitted.
    if (req_url.lastIndexOf("//", 0) === -1) {
      // "//" is omitted.
      req_url = "//" + req_url;
    }
    req_url = (match[4] === "443" ? "https:" : "http:") + req_url;
  }
  var parsed = url.parse(req_url);
  if (!parsed.hostname) {
    // "http://:1/" and "http:/notenoughslashes" could end up here.
    return null;
  }
  return parsed;
}
