import express from "express";

import {
  getIndicators,
  getS2
} from "../controllers/indicatorController.js";

const router =
  express.Router();

router.get(
  "/:market",
  getIndicators
);

router.get(
  "/:market/s2",
  getS2
);

export default router;