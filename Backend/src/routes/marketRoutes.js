import express from "express";

import {
  getMarkets,
  getMarket
} from "../controllers/marketController.js";

const router =
  express.Router();

router.get(
  "/",
  getMarkets
);

router.get(
  "/:market",
  getMarket
);

export default router;