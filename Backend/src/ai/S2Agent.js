import {
  ChatGoogleGenerativeAI
} from "@langchain/google-genai";

import {
  config
} from "../config/config.js";

let model = null;

/* =========================================================
   GEMINI MODEL
========================================================= */

function getModel() {

  if (!config.geminiApiKey) {
    return null;
  }

  if (!model) {

    model =
      new ChatGoogleGenerativeAI({

        apiKey:
          config.geminiApiKey,

        model:
          "gemini-2.5-flash",

        temperature: 0.2
      });
  }

  return model;
}

/* =========================================================
   S² AI EXPLANATION
========================================================= */

export async function explainS2({
  market,
  question,
  price,
  indicators,
  signal
}) {

  const llm = getModel();

  if (!llm) {

    throw new Error(
      "GEMINI_API_KEY is missing"
    );
  }

  const prompt = `
You are the S² Trading Intelligence Assistant.

Your job is to explain the current deterministic
S² engine state.

Do not invent market data.
Do not change the S² signal.
Do not guarantee future price movement.
Do not promise profit.
Do not create an independent BUY or SELL signal.

Market:
${market}

Current price:
${price}

EMA 9:
${indicators.ema9}

EMA 20:
${indicators.ema20}

VWAP:
${indicators.vwap}

RSI 14:
${indicators.rsi14}

S² action:
${signal.action}

S² score:
${signal.score}

S² trend:
${signal.trend}

S² reasons:
${signal.reasons.join(", ")}

User question:
${question}

Explain the current state clearly for a developer
building a trading intelligence dashboard.

Mention uncertainty when appropriate.
`;

  const response =
    await llm.invoke(prompt);

  return response.content;
}