import { Router, Request, Response, NextFunction } from "express";
import { body, query, header, validationResult } from "express-validator";

import { getRequestQuery, responseParsed, errorLog } from "../helpers";
import { Order } from "../models/order";

const router = Router();

export default router;
