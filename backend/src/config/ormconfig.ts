import "dotenv/config";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: process.env.DB_LOGGING === "true" ? true : false,
  synchronize: true,
  entities: ["src/entities/**/*.ts", "dist/entities/**/*.js"],
  migrations: ["src/migrations/**/*.ts", "dist/migrations/**/*.js"],
  subscribers: ["src/subscribers/**/*.ts", "dist/subscribers/**/*.js"],
});
