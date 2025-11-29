import "dotenv/config";
import "reflect-metadata";
import express from "express";
import cors from "cors";
import "@/container";
import { parseAllowedOrigins } from "@/utils/parse-allowed-origins.util";
import { authRoutes } from "@/routes/auth.route";
import { productRoutes } from "@/routes/product.route";
import { errorHandler } from "@/middlewares/error-handler.middleware";

const app = express();

app.use(cors({
    origin: parseAllowedOrigins(process.env.CORS_ORIGIN),
    credentials: true,
}));

app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use(errorHandler);

export { app };
