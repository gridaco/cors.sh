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
        destination: "https://docs.cors.sh",
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
        source: "/http\\:\\/:host/:path*",
        destination: "https://cors.bridged.cc/http\\::host/:path*",
        basePath: false,
        permanent: true,
      },
      {
        source: "/https\\:\\/:host/:path*",
        destination: "https://cors.bridged.cc/https\\::host/:path*",
        basePath: false,
        permanent: true,
      },
      {
        source: "/console",
        destination: "https://console.grida.co/cors-proxy",
        permanent: true,
      },
    ];
  },
};
module.exports = config;
