import { markets } from "../markets/marketConfig.js";

import { addCandle } from "./candleService.js";

import { calculateEMA } from "./emaService.js";

import { calculateVWAP } from "./vwapService.js";

import { calculateRSI } from "./rsiService.js";

import { calculateS2 } from "./s2Engine.js";

import { marketState } from "../state/marketState.js";

/*
=========================================================
INITIALIZE MARKETS
=========================================================

Historical REST loading is intentionally disabled.

Reason:
Binance REST was returning:

418
-1003
Way too much request weight used

Live candle data will come from Binance WebSocket.
*/

export async function initializeMarkets() {
  for (const market of Object.values(markets)) {
    try {
      console.log(
        `${market.symbol}: Starting live market initialization...`
      );

      /*
      ---------------------------------------------------
      Make sure market state exists
      ---------------------------------------------------
      */

      if (!marketState[market.key]) {
        marketState[market.key] = {
          candles: [],
          currentPrice: null,

          indicators: {
            ema9: null,
            ema20: null,
            vwap: null,
            rsi14: null
          },

          signal: {
            action: "WAIT",
            score: 0,
            trend: "NEUTRAL",
            reasons: []
          }
        };
      }

      /*
      ---------------------------------------------------
      Calculate initial indicators
      ---------------------------------------------------
      */

      updateMarketIndicators(market.key);

      console.log(
        `${market.symbol}: Ready for Binance WebSocket candles`
      );

    } catch (error) {
      console.error(
        `Failed to initialize ${market.symbol}:`,
        error.message
      );
    }
  }
}


/*
=========================================================
UPDATE MARKET INDICATORS
=========================================================
*/

export function updateMarketIndicators(marketKey) {
  const state = marketState[marketKey];

  if (!state) {
    console.error(
      `Market state not found for ${marketKey}`
    );

    return;
  }

  const candles = state.candles || [];


  /*
  -------------------------------------------------------
  EMA 9
  -------------------------------------------------------
  */

  const ema9 = calculateEMA(
    candles,
    9
  );


  /*
  -------------------------------------------------------
  EMA 20
  -------------------------------------------------------
  */

  const ema20 = calculateEMA(
    candles,
    20
  );


  /*
  -------------------------------------------------------
  VWAP
  -------------------------------------------------------
  */

  const vwap = calculateVWAP(
    candles
  );


  /*
  -------------------------------------------------------
  RSI 14
  -------------------------------------------------------
  */

  const rsi14 = calculateRSI(
    candles,
    14
  );


  /*
  -------------------------------------------------------
  S² ENGINE
  -------------------------------------------------------
  */

  const signal = calculateS2({
    price: state.currentPrice,
    ema9,
    ema20,
    vwap,
    rsi14
  });


  /*
  -------------------------------------------------------
  SAVE INDICATORS
  -------------------------------------------------------
  */

  state.indicators = {
    ema9,
    ema20,
    vwap,
    rsi14
  };


  /*
  -------------------------------------------------------
  SAVE S² SIGNAL
  -------------------------------------------------------
  */

  state.signal = signal;
}


/*
=========================================================
PROCESS NEW LIVE CANDLE
=========================================================

This function can be called by the Binance WebSocket
whenever a new candle arrives.
=========================================================
*/

export function processLiveCandle(
  marketKey,
  candle
) {
  if (!marketState[marketKey]) {
    console.error(
      `Unknown market: ${marketKey}`
    );

    return;
  }

  /*
  Add/update candle
  */

  addCandle(
    marketKey,
    candle
  );


  /*
  Recalculate indicators
  */

  updateMarketIndicators(
    marketKey
  );


  /*
  Debug information
  */

  const state =
    marketState[marketKey];

  console.log(
    `${marketKey}:`,
    `Price=${state.currentPrice}`,
    `Candles=${state.candles.length}`,
    `EMA9=${state.indicators.ema9}`,
    `EMA20=${state.indicators.ema20}`,
    `VWAP=${state.indicators.vwap}`,
    `RSI14=${state.indicators.rsi14}`,
    `S²=${state.signal.action}`,
    `Score=${state.signal.score}`
  );
}