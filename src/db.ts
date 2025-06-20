import { Sequelize } from "sequelize-typescript";
import config from "./config/config"; // your config.ts
import path from "path";

const env = process.env.NODE_ENV || "development";

// Create a Sequelize instance using your config
const sequelize = new Sequelize({
  ...config[env],
  models: [], // Pass an empty array or omit the option entirely
});

// Add models to the Sequelize instance
const modelPaths = [path.join(__dirname, "models/**/*.model.{ts,js}")];
sequelize.addModels(modelPaths);

export default sequelize;
