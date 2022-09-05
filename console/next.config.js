const withLinaria = require("next-linaria");
const withTM = require("next-transpile-modules")([
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
