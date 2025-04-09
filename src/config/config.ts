import * as dotenv from "dotenv";
import { DBConfig } from "../interface";

dotenv.config();

const config: { [key: string]: DBConfig } = {
  development: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "my_db",
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT) || 5432,
    dialect: "mysql", // or 'postgres', 'sqlite', etc.
  },
  test: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "my_db",
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT) || 5432,
    dialect: "mysql", // or 'postgres', 'sqlite', etc.
  },
  production: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "my_db",
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT) || 5432,
    dialect: "mysql", // or 'postgres', 'sqlite', etc.
  },
};

export default config;
