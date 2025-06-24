import "reflect-metadata";
import { DataSource } from 'typeorm';
import { User } from './entities/user'
import * as dotenv from 'dotenv';
import { Transaction } from "./entities/transaction";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true, 
    logging: false,
    entities: [User,Transaction],
    migrations: [],
    subscribers: [],
});