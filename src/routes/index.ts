import { Router } from "express";

const routes = Router();

import user from "../controller/user";
routes.use("/user", user);

export default routes;
