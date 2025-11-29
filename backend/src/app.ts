import "dotenv/config";
import "reflect-metadata";
import express from "express";
import cors from "cors";
import session from "express-session";
import { parseAllowedOrigins, getSessionTtl } from "@/utils/env";

const app = express();

app.use(
  cors({
    origin: parseAllowedOrigins(process.env.CORS_ORIGIN),
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET ?? "secret",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: getSessionTtl(process.env.SESSION_TTL_MINUTES),
    },
  })
);

app.get("/", (_req, res) => {
  res.json({ status: 200 });
});

export { app };
