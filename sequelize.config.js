require("ts-node").register();
const config = require("./src/config/config.ts").default; // 👈 grab the default export

module.exports = {
  development: config.development,
  test: config.test,
  production: config.production,
};
