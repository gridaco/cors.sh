import { MB, SEC } from "../_util/size";

export const unknownhostlimit = (req, res, next) => {
  const limit = <SingleProxyRequestLimitPolicy>{
    timeout: 6 * SEC,
    size: 0.1 * MB,
  };
};

function known(url: string): boolean {
  try {
    const u = new URL(url);
    if (isIpAddress(u.hostname)) {
      return false;
    }
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * pure host name e.g. 1.1.1.1 or www.grida.co
 * @param hostname
 * @returns
 */
function isIpAddress(hostname: string): boolean {
  return hostname.match(/[a-z]/i) ? false : true;
}

interface SingleProxyRequestLimitPolicy {
  timeout: number; // max time in ms
  size: number; // max size in bytes
}
