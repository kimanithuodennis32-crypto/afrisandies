import "dotenv/config";
import express from "express";
import cors from "cors";

import { productsRouter } from "./routes/products";
import { ordersRouter } from "./routes/orders";
import { authRouter } from "./routes/auth";
import { adminRouter } from "./routes/admin";

export const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);

// Unknown /api routes should 404 as JSON, not fall through to the website.
app.use("/api", (_req, res) => res.status(404).json({ error: "Not found" }));

// Central error handler: catches anything thrown/rejected in route handlers
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});
