import { Sequelize } from "sequelize-typescript";
import { User } from "./models/user"; // your model(s)
import config from "./config/config"; // your config.ts

const env = process.env.NODE_ENV || "development";

// Create a Sequelize instance using your config
const sequelize = new Sequelize({
  ...config[env],
  models: [User], // Register your models here
});

export default sequelize;
