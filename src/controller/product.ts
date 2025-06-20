import { Router, Request, Response, NextFunction } from "express";
import { body, query, header, validationResult } from "express-validator";

import { getRequestQuery, responseParsed, errorLog } from "../helpers";
import { Product } from "../models/product";

const router = Router();

router.get(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const err = validationResult(req);
    if (err.isEmpty()) {
      try {
        const queryOptions = getRequestQuery(req);

        const { count, rows: products } = await Product.findAndCountAll({
          limit: queryOptions.limit,
          offset: queryOptions.offset,
          order: [[queryOptions.sortBy, queryOptions.sortMode]], // <-- Enhanced with sorting
        });

        queryOptions.totalPages = Math.ceil(count / queryOptions.limit);
        queryOptions.total = count;

        return res
          .status(200)
          .json(responseParsed.apiCollection(queryOptions, products));
      } catch (error) {
        errorLog(error, res);
      }
    } else {
      return res
        .status(400)
        .json(
          responseParsed.errorResponse(
            "Forms is not completed, please check again",
            400,
            err.array()
          )
        );
    }
  }
);

export default router;
