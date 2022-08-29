/**
 * @type {import('next').NextConfig}
 */
const config = {
  rewrites: [
    {
      source: "/:target",
      destination: "https://api.cors.sh/:target",
    },
    {
      source: "/playground",
      destination: "https://playground.cors.sh",
    },
    {
      source: "/playground/:path*",
      destination: "https://playground.cors.sh/:path*",
    },
  ],
  redirects: [
    {
      source: "/console",
      destination: "https://console.grida.co/cors-proxy",
      permanent: true,
    },
  ],
};
module.exports = config;
