/**
 * We store grida token to session storate, for one-time verification use. once the sign-in to services.cors.sh is complete, this will be cleared immediately.
 */
export const AuthStore = {
  get: () => {
    return sessionStorage.getItem("grida_token");
  },
  set: (token: string) => {
    sessionStorage.setItem("grida_token", token);
  },
  clear: () => {
    sessionStorage.clear();
  },
};
