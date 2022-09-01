/**
 * proxy.cors.sh static api key header
 */
export const STATIC_CORS_ACCOUNT_API_KEY_HEADER = "x-cors-grida-api-key";

const MINUTE = 60 * 1000;
export const RATE_LIMIT_WINDOW_MS = 60 * MINUTE;
export const RATE_LIMIT_FREE_AUTHORIZED_PER_HOUR = 500; // 500
export const RATE_LIMIT_FREE_ANONYMOUS_PER_HOUR = 100; // 100
