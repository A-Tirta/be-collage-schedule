import { Dialect } from "sequelize";

export interface DBConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: Dialect;
}

export interface returnResponse {
  meta: {
    status: number;
    message: string;
    total?: number;
    perPage?: number;
    page?: number;
    lastPage?: number;
  };
  data?: any;
  info?: any;
}

export interface token {
  id: number;
}

export interface pagination {
  limit: number;
  offset: number;
  page: number;
  sortBy: string;
  sortMode: string;
  total?: number;
  totalPages?: number;
}
