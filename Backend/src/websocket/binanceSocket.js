import WebSocket from "ws";

import {
  getMarketBySymbol
} from "../markets/marketConfig.js";

import {
  addCandle
} from "../services/candleService.js";

import {
  calculateEMA
} from "../services/emaService.js";

import {
  calculateVWAP
} from "../services/vwapService.js";

import {
  calculateRSI
} from "../services/rsiService.js";

import {
  calculateS2
} from "../services/s2Engine.js";

import {
  marketState
} from "../state/marketState.js";

import {
  broadcastMarket
} from "./clientSocket.js";

const streams =
  "btcusdt@kline_5m/" +
  "ethusdt@kline_5m/" +
  "paxgusdt@kline_5m";

const BINANCE_URL =
  `wss://stream.binance.com:9443/stream?streams=${streams}`;

let socket;

export function startBinanceSocket() {
  socket = new WebSocket(BINANCE_URL);

  socket.on("open", () => {
    console.log(
      "Connected to Binance WebSocket"
    );
  });

  socket.on("message", (rawData) => {
    try {
      const message =
        JSON.parse(rawData.toString());

      const kline =
        message?.data?.k;

      if (!kline) return;

      const market =
        getMarketBySymbol(
          kline.s
        );

      if (!market) return;

      const candle = {
        time: Math.floor(
          kline.t / 1000
        ),

        open: Number(kline.o),
        high: Number(kline.h),
        low: Number(kline.l),
        close: Number(kline.c),
        volume: Number(kline.v),

        closed: Boolean(kline.x)
      };

      addCandle(
        market.key,
        candle
      );

      updateIndicators(
        market.key
      );

      broadcastMarket(
        market.key
      );
    } catch (error) {
      console.error(
        "Binance message error:",
        error.message
      );
    }
  });

  socket.on("close", () => {
    console.log(
      "Binance socket closed. Reconnecting..."
    );

    setTimeout(
      startBinanceSocket,
      3000
    );
  });

  socket.on("error", (error) => {
    console.error(
      "Binance WebSocket error:",
      error.message
    );
  });
}

function updateIndicators(
  marketKey
) {
  const state =
    marketState[marketKey];

  const candles =
    state.candles;

  const ema9 =
    calculateEMA(
      candles,
      9
    );

  const ema20 =
    calculateEMA(
      candles,
      20
    );

  const vwap =
    calculateVWAP(
      candles
    );

  const rsi14 =
    calculateRSI(
      candles,
      14
    );

  const signal =
    calculateS2({
      price: state.currentPrice,
      ema9,
      ema20,
      vwap,
      rsi14
    });

  state.indicators = {
    ema9,
    ema20,
    vwap,
    rsi14
  };

  state.signal = signal;
}