// import { Application } from "@prisma/client";

export function mask(
  signed: Application & {
    apikey_test: string;
    apikey_live: string;
  }
) {
  return {
    id: signed.id,
    name: signed.name,
    allowedOrigins: signed.allowedOrigins,
    allowedTargets: signed.allowedTargets,
    // available once
    apikey_test: signed.apikey_test,
    apikey_live: signed.apikey_live,
  };
}
