const withLinaria = require("next-linaria");
const withTM = require("next-transpile-modules")([
  "@app/ui",
  "@cors.sh/service-api",
  "@editor-ui/console",
]);

/**
 * @type {import('next').NextConfig}
 */
const nextconfig = {
  basePath: "/console",
};

module.exports = withTM(withLinaria(nextconfig));
