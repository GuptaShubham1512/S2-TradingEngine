import WebSocket from "ws";

import { getMarketBySymbol } from "../markets/marketConfig.js";
import { addCandle } from "../services/candleService.js";
import { updateMarketIndicators } from "../services/marketInitializer.js";
import { marketState } from "../state/marketState.js";
import { broadcastMarket } from "./clientSocket.js";

const streams =
  "btcusdt@kline_5m/" +
  "ethusdt@kline_5m";

const BINANCE_URL =
  `wss://stream.binance.com:9443/stream?streams=${streams}`;

let socket;

export function startBinanceSocket() {
  console.log("Starting Binance WebSocket...");

  socket = new WebSocket(BINANCE_URL);

  socket.on("open", () => {
    console.log("Connected to Binance WebSocket");
    console.log("Listening for 5-minute candles:");
    console.log("BTCUSDT");
    console.log("ETHUSDT");
  });

  socket.on("message", (rawData) => {
    try {
      const message = JSON.parse(rawData.toString());
      const kline = message?.data?.k;

      if (!kline) return;

      const market = getMarketBySymbol(kline.s);

      if (!market) {
        console.warn(`Unknown Binance symbol: ${kline.s}`);
        return;
      }

      const candle = {
        time: Math.floor(kline.t / 1000),
        open: Number(kline.o),
        high: Number(kline.h),
        low: Number(kline.l),
        close: Number(kline.c),
        volume: Number(kline.v),
        closed: Boolean(kline.x)
      };

      addCandle(market.key, candle);

      updateMarketIndicators(market.key);

      broadcastMarket(market.key);

      const state = marketState[market.key];

      console.log(
        `${market.symbol} | ` +
        `Price: ${state.currentPrice} | ` +
        `Candles: ${state.candles.length} | ` +
        `EMA9: ${formatValue(state.indicators.ema9)} | ` +
        `EMA20: ${formatValue(state.indicators.ema20)} | ` +
        `VWAP: ${formatValue(state.indicators.vwap)} | ` +
        `RSI14: ${formatValue(state.indicators.rsi14)} | ` +
        `S²: ${getSignalAction(state.signal)}`
      );

    } catch (error) {
      console.error(
        "Binance message error:",
        error.message
      );
    }
  });

  socket.on("close", () => {
    console.log("Binance WebSocket closed.");
    console.log("Reconnecting in 3 seconds...");

    setTimeout(startBinanceSocket, 3000);
  });

  socket.on("error", (error) => {
    console.error(
      "Binance WebSocket error:",
      error.message
    );
  });
}

function formatValue(value) {
  if (value === null || value === undefined) {
    return "N/A";
  }

  if (typeof value !== "number") {
    return value;
  }

  if (Number.isNaN(value)) {
    return "N/A";
  }

  return value.toFixed(2);
}

function getSignalAction(signal) {
  if (!signal) return "WAIT";

  if (typeof signal === "string") {
    return signal;
  }

  return signal.action || "WAIT";
}