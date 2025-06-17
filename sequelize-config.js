// sequelize-config.js
require("ts-node/register"); // allows Node to understand TypeScript
const config = require("./src/config/config.ts").default;

module.exports = config;
