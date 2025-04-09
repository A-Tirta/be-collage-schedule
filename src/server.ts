import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { JWTCheck } from "./middleware";
import rootRoutes from "./routes";
import sequelize from "./db";

async function main() {
  dotenv.config();

  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN || "*", // use env for flexibility
      credentials: true,
    })
  );

  app.use(cookieParser());

  // JWT Middleware
  app.use(JWTCheck);

  // Routes
  app.use(rootRoutes);

  try {
    await sequelize.authenticate();
    console.log("✅ Database connection has been established successfully.");

    await sequelize.sync({ alter: true }); // consider `{ force: true }` only in dev, `alter: true` is safer
    console.log("🔁 All models were synchronized successfully.");

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`🚀 Server Up and Running Port: ${port}`);
    });
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    process.exit(1); // Exit if DB fails
  }
}

main();
