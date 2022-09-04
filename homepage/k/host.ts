export const HOST =
  process.env.NODE_ENV === "production"
    ? "https://cors.sh"
    : "http://localhost:8823";

export const SERVER_URL =
  process.env.NODE_ENV === "production"
    ? // TODO: this url is not live.
      "https://cors-proxy-service.services.grida.co"
    : "http://localhost:4021";
