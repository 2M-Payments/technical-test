import "reflect-metadata";
import express from "express";
import cors from "cors";
import { router } from "./routes/musicoRoutes";
import session from "express-session";
import dotenv from "dotenv";import { errorMiddleware } from "./middlewares/errorMiddleware";



dotenv.config();

const app = express();

// Configuração do middleware
app.use(express.json());
app.use(cors());
app.use(errorMiddleware);

// Configuração da sessão
app.use(
    session({
        secret: process.env.SESSION_SECRET || "default_secret",
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 30 * 60 * 1000 }, // 30 minutos
    })
);

// Rotas
app.use("/api", router);

export { app };
