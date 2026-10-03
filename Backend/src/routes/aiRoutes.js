
import express from "express";

import {
  chatWithAI
} from "../controllers/aiController.js";

const router =
  express.Router();

/*
 * POST
 * /api/ai/:market/chat
 *
 * Examples:
 *
 * /api/ai/BTC/chat
 * /api/ai/ETH/chat
 * /api/ai/GOLD/chat
 */
router.post(
  "/:market/chat",
  chatWithAI
);

export default router;

