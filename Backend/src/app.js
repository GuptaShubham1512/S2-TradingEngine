import express from "express";
import cors from "cors";

import marketRoutes from "./routes/marketRoutes.js";
import indicatorRoutes from "./routes/indicatorRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app =
  express();

app.use(
  cors({
    origin: "http://localhost:5173"
  })
);

app.use(
  express.json()
);

app.get(
  "/",
  (req, res) => {
    res.json({
      message:
        "S² Trading Intelligence Engine API",
      status:
        "running"
    });
  }
);

app.use(
  "/api/markets",
  marketRoutes
);

app.use(
  "/api/indicators",
  indicatorRoutes
);

app.use(
  "/api/ai",
  aiRoutes
);

export default app;