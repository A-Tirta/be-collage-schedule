import * as dotenv from "dotenv";
import { expressjwt } from "express-jwt";

dotenv.config();

export const JWTCheck = expressjwt({
  secret: process.env.TOKEN as string,
  algorithms: ["HS256"],
}).unless({
  path: ["/user/login", "/status", "/user/register", "/agent/llm-stream"],
});
