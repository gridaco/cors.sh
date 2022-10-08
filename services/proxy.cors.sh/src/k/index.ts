/**
 * this is temporarlly used to determine if the request is a paid request.
 * will be changed to detect all free & paid
 */
export const STATIC_CORS_ACCOUNT_API_KEY_HEADER_FOR_PAID_TIER =
  "x-cors-api-key" as const;

/**
 * proxy.cors.sh static api key header
 */
export const STATIC_CORS_ACCOUNT_API_KEY_HEADERS = [
  "x-cors-grida-api-key", // legacy header for cors.bridged.cc
  STATIC_CORS_ACCOUNT_API_KEY_HEADER_FOR_PAID_TIER, // (legacy, but maintained) header for cors.sh
];

const MINUTE = 60 * 1000;
export const RATE_LIMIT_WINDOW_MS = 60 * MINUTE;
export const RATE_LIMIT_FREE_AUTHORIZED_PER_HOUR = 500; // 500
export const RATE_LIMIT_FREE_ANONYMOUS_PER_HOUR = 100; // 100
