import {
  marketState
} from "../state/marketState.js";

import {
  explainS2
} from "../ai/S2Agent.js";

export async function chatWithAI(req, res) {
  try {
    const key =
      req.params.market.toUpperCase();

    const state =
      marketState[key];

    if (!state) {
      return res.status(404).json({
        message: "Market not found"
      });
    }

    const {
      message
    } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Message is required"
      });
    }

    console.log(
      "AI request:",
      key,
      message
    );

    const answer =
      await explainS2({
        market: state.symbol,
        question: message,
        price: state.currentPrice,
        indicators: state.indicators,
        signal: state.signal
      });

    console.log(
      "Gemini response received"
    );

    return res.json({
      answer
    });

  } catch (error) {

    console.error(
      "================================"
    );

    console.error(
      "AI ERROR:"
    );

    console.error(
      error
    );

    console.error(
      "ERROR MESSAGE:",
      error?.message
    );

    console.error(
      "ERROR STATUS:",
      error?.status
    );

    console.error(
      "================================"
    );

    return res.status(500).json({
      message: "AI service failed",
      error: error?.message || "Unknown AI error"
    });
  }
}

