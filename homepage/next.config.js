const withLinaria = require("next-linaria");
const withTM = require("next-transpile-modules")([
  "@app/ui",
  "@cors.sh/service-api",
  "@editor-ui/console",
]);

const CONSOLE_URL = process.env.CONSOLE_URL;
/**
 * @type {import('next').NextConfig}
 */
const config = {
  rewrites() {
    return [
      {
        source: "/playground",
        destination: "https://playground.cors.sh",
      },
      {
        source: "/playground/:path*",
        destination: "https://playground.cors.sh/:path*",
      },
      {
        source: "/console",
        destination: CONSOLE_URL,
      },
      {
        source: "/console/:path*",
        destination: CONSOLE_URL + "/:path*",
      },
      {
        source: "/docs",
        destination: "https://docs.cors.sh/intro",
      },
      {
        source: "/docs/:path*",
        destination: "https://docs.cors.sh/:path*",
      },
    ];
  },
  redirects() {
    return [
      {
        source: "/http\\://:path*",
        destination: "https://proxy.cors.sh/http\\://:path*",
        basePath: false,
        permanent: true,
      },
      {
        source: "/https\\://:path*",
        destination: "https://proxy.cors.sh/https\\://:path*",
        basePath: false,
        permanent: true,
      },
      {
        // if pyament is canceled, go back to get started page.
        source: "/payments/canceled",
        destination: "/get-started",
        permanent: true,
      },
      // {
      //   source: "/console",
      //   destination: "https://console.grida.co/cors-proxy",
      //   permanent: true,
      // },
      {
        source: "/docs",
        destination: "/docs/intro",
        permanent: true,
      },
    ];
  },
};
module.exports = withTM(withLinaria(config));
