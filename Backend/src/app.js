import express from "express";
import cors from "cors";

import marketRoutes from "./routes/marketRoutes.js";
import indicatorRoutes from "./routes/indicatorRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://s2-trading-engine-go7c.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an Origin header
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked origin: ${origin}`)
      );
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "S² Trading Intelligence Engine API",
    status: "running"
  });
});

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