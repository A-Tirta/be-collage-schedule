import { Request } from "express";
import { pagination } from "../interface";

/**
 * Extracts and sanitizes pagination and sorting query parameters from a request.
 *
 * @param req - The Express request object.
 * @returns An object containing limit, offset, page, sortBy, and sortMode.
 */
export function getRequestQuery(req: Request): pagination {
  const query = req.query;

  const page = Number(query.page) > 0 ? Number(query.page) : 1;
  const perPage = Number(query.perPage) > 0 ? Number(query.perPage) : 10;
  const offset = (page - 1) * perPage;
  const sortBy = (query.sort_by as string) || "id";
  const sortMode = (query.sort_mode as string) || "desc";

  return {
    limit: perPage,
    offset,
    page,
    sortBy,
    sortMode,
  };
}
