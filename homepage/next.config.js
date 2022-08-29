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
      source: "/playground/:path*",
      destination: "https://playground.cors.sh/:path*",
    },
  ],
};
module.exports = config;
