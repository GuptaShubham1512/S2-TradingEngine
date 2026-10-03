import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,

  geminiApiKey:
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY,

  binanceRest:
    "https://api.binance.com",

  binanceWebSocket:
    "wss://stream.binance.com:9443/stream",
};