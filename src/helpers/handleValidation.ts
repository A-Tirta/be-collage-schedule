import { Response } from "express";
import { responseParsed } from "../helpers";

const handleValidation = async (
  response: Response,
  error: any
): Promise<Response | void> => {
  return response
    .status(400)
    .json(
      responseParsed.errorResponse(
        "Forms is not completed, please check again",
        400,
        error.array()
      )
    );
};

export default handleValidation;
