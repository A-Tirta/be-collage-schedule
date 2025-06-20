import { Response } from "express";
import { responseParsed } from "../helpers";

const errorLog = async (
  error: any,
  response: Response | null = null
): Promise<Response | void> => {
  // Using console.error is a better practice for logging errors
  console.error(error);

  if (response) {
    return response.status(500).send(responseParsed.unknownError());
  }
};

export default errorLog;
