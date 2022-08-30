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
        source: "/console",
        destination: "https://console.grida.co/cors-proxy",
        permanent: true,
      },
      {
        source: "/docs",
        destination: "/docs/intro",
        permanent: true,
      },
    ];
  },
};
module.exports = config;
