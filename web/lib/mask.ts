import { Application } from "@/types/app";

export function mask(
  signed: Application & {
    apikey_test: string;
    apikey_live: string;
  }
) {
  return {
    id: signed.id,
    name: signed.name,
    allowedOrigins: signed.allowed_origins,
    allowedTargets: signed.allowed_targets,
    // available once
    apikey_test: signed.apikey_test,
    apikey_live: signed.apikey_live,
  };
}
