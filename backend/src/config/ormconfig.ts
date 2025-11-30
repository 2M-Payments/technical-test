import "dotenv/config";
import { DataSource } from "typeorm";
import { User } from "@/entities/user.entity";
import { Product } from "@/entities/product.entity";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: process.env.DB_LOGGING === "true" ? true : false,
  synchronize: true,
  entities: [User, Product],
  migrations: [],
  subscribers: [],
});
