import { Router, Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { genSalt, hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

import { responseParsed, errorLog, handleValidation } from "../helpers";
import { token } from "../interface";
import { tokenConverter } from "../function";
import { User } from "../models/user";

const router = Router();

router.post(
  "/register",
  body("email").isEmail().isLength({ max: 50 }),
  body("name").isString().isLength({ max: 255 }),
  body("password").isString(),
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const err = validationResult(req);

    if (err.isEmpty()) {
      try {
        const { name, email, password } = req.body;

        const getUserData = await User.findOne({ where: { email: email } });

        if (!getUserData) {
          const salt = await genSalt(10);
          const hashedPassword = await hash(password, salt);

          const data = await User.create({
            name: name,
            email: email,
            password: hashedPassword,
          });

          return res.status(201).json(responseParsed.apiCreated(data));
        } else {
          return res.status(404).json(responseParsed.dataNotFound());
        }
      } catch (error) {
        errorLog(error, res);
      }
    } else {
      handleValidation(res, err);
    }
  }
);

router.post(
  "/login",
  body("email").optional().isEmail().isLength({ max: 50 }),
  body("password").isString(),
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const err = validationResult(req);

    if (err.isEmpty()) {
      try {
        const { email, password } = req.body;

        const getUserData = await User.findOne({ where: { email: email } });

        if (getUserData) {
          const validPassword = await compare(password, getUserData.password);

          if (validPassword) {
            const token = sign(
              {
                id: getUserData.id,
              },
              String(process.env.TOKEN),
              {
                expiresIn: "30d",
                algorithm: "HS256",
              }
            );

            return res
              .status(200)
              .json(
                responseParsed.successResponse(token, "Login Successfully")
              );
          }
        } else {
          return res.status(404).json(responseParsed.dataNotFound());
        }
      } catch (error) {
        errorLog(error, res);
      }
    } else {
      handleValidation(res, err);
    }
  }
);

router.get(
  "/profile",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const err = validationResult(req);

    if (err.isEmpty()) {
      try {
        const reader: token = tokenConverter(req.headers["authorization"]!);

        const getUserData = await User.findOne({
          where: { id: reader.id },
          attributes: { exclude: ["password"] },
        });

        if (getUserData) {
          return res.status(200).json(responseParsed.apiItem(getUserData));
        } else {
          return res.status(404).json(responseParsed.dataNotFound());
        }
      } catch (error) {
        errorLog(error, res);
      }
    } else {
      handleValidation(res, err);
    }
  }
);

export default router;
