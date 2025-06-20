import { Request } from "express";

/**
 * Extracts and sanitizes pagination and sorting query parameters from a request.
 *
 * @param req - The Express request object.
 * @returns An object containing limit, offset, page, sortBy, and sortMode.
 */
export function getRequestQuery(req: Request): any {
  let query: any = req.query;

  query.page = Number(query.page) > 0 ? Number(query.page) : 1;
  query.limit = Number(query.limit) > 0 ? Number(query.limit) : 10;
  query.perPage = query.limit;
  query.offset = (query.page - 1) * query.limit;
  query.sortBy = (query.sort_by as string) || "id";
  query.sortMode = (query.sort_mode as string) || "desc";

  return query;
}
