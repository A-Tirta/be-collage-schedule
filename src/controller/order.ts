import { Router, Request, Response, NextFunction } from "express";
import { body, query, header, validationResult } from "express-validator";
import { Op } from "sequelize";

import {
  getRequestQuery,
  responseParsed,
  errorLog,
  handleValidation,
} from "../helpers";
import { tokenConverter } from "../function";
import { token } from "../interface";
import { Order } from "../models/order";
import { Product } from "../models/product";
import { User } from "../models/user";

const router = Router();

router.get(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const err = validationResult(req);
    if (err.isEmpty()) {
      try {
        const reader: token = tokenConverter(req.headers["authorization"]!);
        const queryOptions = getRequestQuery(req);

        const where: any = {};
        if (queryOptions.search && queryOptions.search != "") {
          // Using Op.like for a partial match. For PostgreSQL, Op.iLike is great for case-insensitivity.
          where.name = { [Op.like]: `%${queryOptions.search}%` };
        }

        if (queryOptions.is_member !== undefined) {
          // If is_member is provided, filter by it
          where.user_id = reader.id; // Assuming you want to filter orders by the logged-in user
        }

        const { count, rows: orders } = await Order.findAndCountAll({
          limit: queryOptions.limit,
          offset: queryOptions.offset,
          order: [[queryOptions.sortBy, queryOptions.sortMode]], // <-- Enhanced with sorting
          where: where, // <-- Add the conditional where clause here
          include: [
            {
              model: User,
              attributes: ["id", "name", "email"],
            },
            {
              model: Product,
              attributes: ["id", "name", "description"],
            },
          ],
        });

        queryOptions.totalPages = Math.ceil(count / queryOptions.limit);
        queryOptions.total = count;

        return res
          .status(200)
          .json(responseParsed.apiCollection(queryOptions, orders));
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
        const order = await Order.findByPk(id, {
          include: [
            {
              model: User,
              attributes: ["id", "name", "email"],
            },
            {
              model: Product,
              attributes: ["id", "name", "description"],
            },
          ],
        });

        if (!order) {
          return res.status(404).json(responseParsed.dataNotFound());
        }

        return res.status(200).json(responseParsed.apiItem(order));
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
  body("product_id").isInt({ gt: 0 }),
  body("quantity").isInt({ gt: 0 }),
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const err = validationResult(req);
    if (err.isEmpty()) {
      try {
        const reader: token = tokenConverter(req.headers["authorization"]!);
        const body = req.body;
        const product = await Product.findByPk(body.product_id);

        if (!product) {
          return res.status(404).json(responseParsed.dataNotFound());
        }

        // Calculate line total
        const lineTotal = product.price * body.quantity;

        // Create the order
        body.user_id = reader.id;
        body.price_per_unit = product.price;
        body.line_total = lineTotal;
        body.status = "PENDING"; // Default status for new orders

        const data = await Order.create(body);

        return res.status(200).json(responseParsed.apiCreated(data));
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
  body("product_id").isInt({ gt: 0 }),
  body("quantity").isInt({ gt: 0 }),
  body("status").optional().isString(),
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const err = validationResult(req);
    if (err.isEmpty()) {
      const { id }: any = req.params;
      try {
        const body = req.body;
        const order = await Order.findByPk(id);
        const product = await Product.findByPk(body.product_id);

        if (!order || !product) {
          return res.status(404).json(responseParsed.dataNotFound());
        }

        // Calculate line total
        const lineTotal = product.price * body.quantity;

        // Create the order
        body.price_per_unit = product.price;
        body.line_total = lineTotal;

        // Update the order
        await order.update(body);

        return res.status(200).json(responseParsed.apiUpdated(order));
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
      try {
        const { id }: any = req.params;
        const data = await Order.findByPk(id);

        if (!data) {
          return res.status(404).json(responseParsed.dataNotFound());
        }

        await Order.destroy({
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
