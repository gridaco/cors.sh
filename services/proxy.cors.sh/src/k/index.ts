/**
 * proxy.cors.sh static api key header
 */
export const STATIC_CORS_ACCOUNT_API_KEY_HEADERS = [
  "x-cors-grida-api-key", // legacy header for cors.bridged.cc
  "x-cors-api-key", // header for cors.sh
];

export const RATE_LIMIT_FREE_AUTHORIZED_PER_HOUR = 500; // 500
export const RATE_LIMIT_FREE_ANONYMOUS_PER_HOUR = 100; // 100
