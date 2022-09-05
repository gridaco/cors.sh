import { cors, __HOSTS } from "@base-sdk/core";
import {
  __auth_proxy,
  ProxyAuthenticationMode,
  AuthProxySessionStartRequest,
  AuthProxySessionStartResult,
} from "@base-sdk-fp/auth";
import { AuthStore } from ".";
import { nanoid } from "nanoid";
// it is ok to load dynamically since its cli env.
const PROXY_AUTH_REQUEST_SECRET = () =>
  process.env
    .NEXT_PUBLIC_GRIDA_FIRST_PARTY_PROXY_AUTH_REQUEST_TOTP_SECRET as string;

function _make_request(redirect_uri: string): AuthProxySessionStartRequest {
  return {
    // TODO: change this later
    appId: "co.grida.assistant",
    clientId: nanoid(),
    mode: ProxyAuthenticationMode.long_polling,
    redirect_uri: redirect_uri,
  };
}

// export async function startAuthenticationSession(): Promise<AuthProxySessionStartResult> {
//   return __auth_proxy.openProxyAuthSession(
//     PROXY_AUTH_REQUEST_SECRET(),
//     _make_request()
//   );
// }

// export async function startAuthenticationWithSession(
//   session: AuthProxySessionStartResult
// ) {
//   const result = await __auth_proxy.requesetProxyAuthWithSession(
//     PROXY_AUTH_REQUEST_SECRET(),
//     session,
//     _make_request()
//   );

//   AuthStore.set(result.access_token!);
//   // save result

//   return result;
// }

// export async function startAuthentication() {
//   const session = await startAuthenticationSession();
//   return await startAuthenticationWithSession(session);
// }

export async function checkAuthSession(session: string): Promise<boolean> {
  // TODO:
  const res = await __auth_proxy.checkProxyAuthResult(
    PROXY_AUTH_REQUEST_SECRET(),
    session
  );

  const success = res.success && res.access_token !== undefined;
  if (success) {
    AuthStore.set(res.access_token!);
  }
  return success;
}
