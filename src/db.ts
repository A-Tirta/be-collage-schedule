import { Sequelize } from "sequelize-typescript";
import { User } from "./models/user";
import { Product } from "./models/product";
import { Order } from "./models/order";
import config from "./config/config"; // your config.ts

const env = process.env.NODE_ENV || "development";

// Create a Sequelize instance using your config
const sequelize = new Sequelize({
  ...config[env],
  models: [User, Product, Order], // Register your models here
});

export default sequelize;
