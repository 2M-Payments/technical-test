import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.BLUEPRINT_DB_USERNAME || "dipirona",
  password: process.env.BLUEPRINT_DB_PASSWORD || "password1234",
  database: process.env.BLUEPRINT_DB_DATABASE || "blueprint",

 entities: [__dirname + '/../entities/*.{ts,js}'],

  migrations: ["src/migrations/**/*.ts"],
  migrationsRun: false,
  migrationsTableName: 'migrations',
  migrationsTransactionMode: 'all',
  logging: process.env.NODE_ENV === "development",
});
