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
        if (queryOptions.search && queryOptions.search != "") {
          // Using Op.like for a partial match. For PostgreSQL, Op.iLike is great for case-insensitivity.
          where.name = { [Op.like]: `%${queryOptions.search}%` };
        }

        if (queryOptions.is_active !== undefined) {
          // If is_active is provided, filter by it
          where.is_active = queryOptions.is_active === "true";
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

router.post(
  "/",
  body("name").isString().isLength({ max: 255 }),
  body("description").isString().optional(),
  body("stock_quantity").isInt({ gt: -1 }),
  body("price").isFloat({ gt: 0 }),
  body("is_active").isBoolean().optional().default(0),
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const err = validationResult(req);
    if (err.isEmpty()) {
      try {
        const body = req.body;

        const product = await Product.create(body);

        return res.status(200).json(responseParsed.apiCreated(product));
      } catch (error) {
        errorLog(error, res);
      }
    } else {
      handleValidation(res, err);
    }
  }
);

router.put(
  "/:id",
  body("name").isString().isLength({ max: 255 }),
  body("description").isString().optional(),
  body("stock_quantity").isInt({ gt: -1 }),
  body("price").isFloat({ gt: 0 }),
  body("is_active").isBoolean().optional().default(0),
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const err = validationResult(req);
    if (err.isEmpty()) {
      const { id }: any = req.params;
      try {
        const body = req.body;
        const product = await Product.findByPk(id);

        if (!product) {
          return res.status(404).json(responseParsed.dataNotFound());
        }

        // First, update the product
        await Product.update(body, {
          where: { id: id },
        });

        // Then, fetch the updated product again
        const updatedProduct = await Product.findByPk(id);

        return res.status(200).json(responseParsed.apiUpdated(updatedProduct));
      } catch (error) {
        errorLog(error, res);
      }
    } else {
      handleValidation(res, err);
    }
  }
);

router.delete(
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

        await Product.destroy({
          where: {
            id: id,
          },
        });

        return res.status(200).json(responseParsed.apiDeleted());
      } catch (error) {
        errorLog(error, res);
      }
    } else {
      handleValidation(res, err);
    }
  }
);

export default router;
