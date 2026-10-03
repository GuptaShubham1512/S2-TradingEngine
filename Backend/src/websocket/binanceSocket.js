import WebSocket from "ws";

import {
  getMarketBySymbol
} from "../markets/marketConfig.js";

import {
  addCandle
} from "../services/candleService.js";

import {
  updateMarketIndicators
} from "../services/marketInitializer.js";

import {
  marketState
} from "../state/marketState.js";

import {
  broadcastMarket
} from "./clientSocket.js";


/*
=========================================================
BINANCE WEBSOCKET CONFIGURATION
=========================================================
*/

const streams =
  "btcusdt@kline_5m/" +
  "ethusdt@kline_5m/" +
  "paxgusdt@kline_5m";

const BINANCE_URL =
  `wss://stream.binance.com:9443/stream?streams=${streams}`;


let socket;


/*
=========================================================
START BINANCE WEBSOCKET
=========================================================
*/

export function startBinanceSocket() {

  console.log(
    "Starting Binance WebSocket..."
  );

  socket = new WebSocket(
    BINANCE_URL
  );


  /*
  -------------------------------------------------------
  CONNECTION OPEN
  -------------------------------------------------------
  */

  socket.on("open", () => {

    console.log(
      "Connected to Binance WebSocket"
    );

    console.log(
      "Listening for 5-minute candles:"
    );

    console.log(
      "BTCUSDT"
    );

    console.log(
      "ETHUSDT"
    );

    console.log(
      "PAXGUSDT"
    );
  });


  /*
  -------------------------------------------------------
  RECEIVE BINANCE MESSAGE
  -------------------------------------------------------
  */

  socket.on(
    "message",
    (rawData) => {

      try {

        const message =
          JSON.parse(
            rawData.toString()
          );


        /*
        ---------------------------------------------------
        GET KLINE DATA
        ---------------------------------------------------
        */

        const kline =
          message?.data?.k;

        if (!kline) {
          return;
        }


        /*
        ---------------------------------------------------
        FIND MARKET CONFIG
        ---------------------------------------------------
        */

        const market =
          getMarketBySymbol(
            kline.s
          );

        if (!market) {

          console.warn(
            `Unknown Binance symbol: ${kline.s}`
          );

          return;
        }


        /*
        ---------------------------------------------------
        CREATE INTERNAL CANDLE
        ---------------------------------------------------
        */

        const candle = {

          time:
            Math.floor(
              kline.t / 1000
            ),

          open:
            Number(kline.o),

          high:
            Number(kline.h),

          low:
            Number(kline.l),

          close:
            Number(kline.c),

          volume:
            Number(kline.v),

          closed:
            Boolean(kline.x)
        };


        /*
        ---------------------------------------------------
        UPDATE CANDLE STATE
        ---------------------------------------------------
        */

        addCandle(
          market.key,
          candle
        );


        /*
        ---------------------------------------------------
        UPDATE EMA / VWAP / RSI / S²
        ---------------------------------------------------
        */

        updateMarketIndicators(
          market.key
        );


        /*
        ---------------------------------------------------
        BROADCAST TO FRONTEND
        ---------------------------------------------------
        */

        broadcastMarket(
          market.key
        );


        /*
        ---------------------------------------------------
        DEBUG OUTPUT
        ---------------------------------------------------
        */

        const state =
          marketState[
            market.key
          ];

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

    }
  );


  /*
  -------------------------------------------------------
  SOCKET CLOSED
  -------------------------------------------------------
  */

  socket.on(
    "close",
    () => {

      console.log(
        "Binance WebSocket closed."
      );

      console.log(
        "Reconnecting in 3 seconds..."
      );

      setTimeout(
        startBinanceSocket,
        3000
      );

    }
  );


  /*
  -------------------------------------------------------
  SOCKET ERROR
  -------------------------------------------------------
  */

  socket.on(
    "error",
    (error) => {

      console.error(
        "Binance WebSocket error:",
        error.message
      );

    }
  );

}


/*
=========================================================
HELPER — FORMAT INDICATOR VALUES
=========================================================
*/

function formatValue(value) {

  if (
    value === null ||
    value === undefined
  ) {
    return "N/A";
  }

  if (
    typeof value !== "number"
  ) {
    return value;
  }

  if (
    Number.isNaN(value)
  ) {
    return "N/A";
  }

  return value.toFixed(2);
}


/*
=========================================================
HELPER — GET S² ACTION
=========================================================
*/

function getSignalAction(signal) {

  if (!signal) {
    return "WAIT";
  }

  if (
    typeof signal === "string"
  ) {
    return signal;
  }

  return (
    signal.action ||
    "WAIT"
  );
}