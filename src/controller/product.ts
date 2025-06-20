import { Router, Request, Response, NextFunction } from "express";
import { body, query, header, validationResult } from "express-validator";
import { Op } from "sequelize";

import {
  getRequestQuery,
  responseParsed,
  errorLog,
  handleValidation,
} from "../helpers";
import { Product } from "../models/product";

const router = Router();

router.get(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const err = validationResult(req);
    if (err.isEmpty()) {
      try {
        const queryOptions = getRequestQuery(req);

        const where: any = {};
        if (queryOptions.search) {
          // Using Op.like for a partial match. For PostgreSQL, Op.iLike is great for case-insensitivity.
          where.name = { [Op.like]: `%${queryOptions.search}%` };
        }

        const { count, rows: products } = await Product.findAndCountAll({
          limit: queryOptions.limit,
          offset: queryOptions.offset,
          order: [[queryOptions.sortBy, queryOptions.sortMode]], // <-- Enhanced with sorting
          where: where, // <-- Add the conditional where clause here
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
      handleValidation(res, err);
    }
  }
);

router.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const err = validationResult(req);
    if (err.isEmpty()) {
      const { id }: any = req.params;
      try {
        const product = await Product.findByPk(id);

        if (!product) {
          return res.status(404).json(responseParsed.dataNotFound());
        }

        return res.status(200).json(responseParsed.apiItem(product));
      } catch (error) {
        errorLog(error, res);
      }
    } else {
      handleValidation(res, err);
    }
  }
);

export default router;
