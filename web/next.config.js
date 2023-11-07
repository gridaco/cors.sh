/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@cors.sh/service-api", "@app/ui", "@editor-ui/console"],
};

module.exports = nextConfig;
