import { Router, Request, Response, NextFunction } from "express";
import { body, query, header, validationResult } from "express-validator";
import { genSalt, hash, compare } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";

import { returnResponse } from "../interface";
import { User } from "../models/user";

const router = Router();

let resObject: returnResponse;

router.post(
  "/register",
  body("email").isEmail().isLength({ max: 50 }),
  body("name").isString().isLength({ max: 255 }),
  body("password").isString(),
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const err = validationResult(req);

    if (err.isEmpty()) {
      try {
        const { name, email, password, ...body } = req.body;

        const getUserData = await User.findOne({ where: { email: email } });

        if (!getUserData) {
          const salt = await genSalt(10);
          const hashedPassword = await hash(password, salt);

          const data = await User.create({
            name: name,
            email: email,
            password: hashedPassword,
          });

          resObject = {
            statuscode: 200,
            data: {
              message: "Data created successfully",
              data: data,
            },
          };
        } else {
          resObject = {
            statuscode: 404,
            data: {
              message: "User already exist, please use different data",
            },
          };
        }
      } catch (error) {
        resObject = {
          statuscode: 500,
          data: {
            message: "There is something wrong with the server",
          },
        };
      }
    } else {
      resObject = {
        statuscode: 400,
        data: {
          message: "Forms is not completed, please check again",
          info: err.array(),
        },
      };
    }

    return res.status(resObject.statuscode).json(resObject.data);
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
        const { email, password, ...body } = req.body;

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
                expiresIn: "5d",
                algorithm: "HS256",
              }
            );

            resObject = {
              statuscode: 200,
              data: {
                message: "User berhasil login",
                info: { token },
              },
            };
          }
        } else {
          resObject = {
            statuscode: 404,
            data: {
              message: "Data not found",
            },
          };
        }
      } catch (error) {
        resObject = {
          statuscode: 500,
          data: {
            message: "There is something wrong with the server",
          },
        };
      }
    } else {
      resObject = {
        statuscode: 400,
        data: {
          message: "Forms is not completed, please check again",
          info: err.array(),
        },
      };
    }

    return res.status(resObject.statuscode).json(resObject.data);
  }
);

router.get(
  "/profile",
  header("authorization").exists(),
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const err = validationResult(req);

    if (err.isEmpty()) {
      try {
        const token = req.header("authorization")?.split(" ")[1];
        const { id: userId } = verify(
          token as string,
          String(process.env.TOKEN)
        ) as { id: string };

        const getUserData = await User.findOne({
          where: { id: userId },
          attributes: { exclude: ["password"] },
        });

        if (getUserData) {
          resObject = {
            statuscode: 200,
            data: {
              message: "Data created successfully",
              data: getUserData,
            },
          };
        } else {
          resObject = {
            statuscode: 404,
            data: {
              message: "Data not found",
            },
          };
        }
      } catch (error) {
        resObject = {
          statuscode: 500,
          data: {
            message: "There is something wrong with the server",
          },
        };
      }
    } else {
      resObject = {
        statuscode: 400,
        data: {
          message: "Forms is not completed, please check again",
          info: err.array(),
        },
      };
    }

    return res.status(resObject.statuscode).json(resObject.data);
  }
);

export default router;
