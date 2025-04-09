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
  statuscode: number;
  data: {
    message: string;
    data?: any;
    info?: any;
  };
}
