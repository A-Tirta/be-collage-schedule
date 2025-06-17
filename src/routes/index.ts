import { Router } from "express";

const routes = Router();

import user from "../controller/user";
routes.use("/user", user);

import agent from "../controller/agent";
routes.use("/agent", agent);

export default routes;
