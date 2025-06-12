import { Product } from "../entities/product";
import "reflect-metadata"
import { DataSource } from "typeorm";
import { DataSourceOptions } from "typeorm/data-source/DataSourceOptions";


type dabatase = "mysql" | "mariadb" | "postgres" | "cockroachdb" | "sqlite" | "mssql" | "sap" | "oracle"
const AppDataSource = new DataSource({
    type: process.env.DB_TYPE as dabatase,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [Product],
} as DataSourceOptions); 

export default AppDataSource;
