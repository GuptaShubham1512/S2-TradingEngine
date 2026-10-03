import { markets } from "../markets/marketConfig.js";

import {
  loadHistoricalCandles,
  addCandle
} from "./candleService.js";

import { calculateEMA } from "./emaService.js";

import { calculateVWAP } from "./vwapService.js";

import { calculateRSI } from "./rsiService.js";

import { calculateS2 } from "./s2Engine.js";

import { marketState } from "../state/marketState.js";


/*
=========================================================
INITIALIZE MARKETS
=========================================================

1. Load 100 historical 5-minute candles
2. Calculate indicators
3. Calculate S² signal
4. Then Binance WebSocket starts from server.js
=========================================================
*/

export async function initializeMarkets() {

  for (const market of Object.values(markets)) {

    try {

      console.log(
        `${market.symbol}: Starting historical market initialization...`
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
      LOAD HISTORICAL CANDLES
      ---------------------------------------------------
      */

      await loadHistoricalCandles(
        market.key,
        market.symbol
      );


      /*
      ---------------------------------------------------
      CALCULATE INDICATORS
      ---------------------------------------------------
      */

      updateMarketIndicators(
        market.key
      );


      /*
      ---------------------------------------------------
      LOG INITIALIZATION RESULT
      ---------------------------------------------------
      */

      const state =
        marketState[market.key];

      console.log(
        `${market.symbol}: Historical initialization complete`
      );

      console.log(
        `${market.symbol}: Candles=${state.candles.length}`
      );

      console.log(
        `${market.symbol}: EMA9=${state.indicators.ema9}`
      );

      console.log(
        `${market.symbol}: EMA20=${state.indicators.ema20}`
      );

      console.log(
        `${market.symbol}: VWAP=${state.indicators.vwap}`
      );

      console.log(
        `${market.symbol}: RSI14=${state.indicators.rsi14}`
      );

      console.log(
        `${market.symbol}: S²=${state.signal.action}`
      );

    } catch (error) {

      console.error(
        `Failed to initialize ${market.symbol}:`,
        error.message
      );

    }

  }

  console.log(
    "All markets initialized with historical data."
  );
}


/*
=========================================================
UPDATE MARKET INDICATORS
=========================================================
*/

export function updateMarketIndicators(
  marketKey
) {

  const state =
    marketState[marketKey];


  if (!state) {

    console.error(
      `Market state not found for ${marketKey}`
    );

    return;

  }


  const candles =
    state.candles || [];


  /*
  -------------------------------------------------------
  EMA 9
  -------------------------------------------------------
  */

  const ema9 =
    calculateEMA(
      candles,
      9
    );


  /*
  -------------------------------------------------------
  EMA 20
  -------------------------------------------------------
  */

  const ema20 =
    calculateEMA(
      candles,
      20
    );


  /*
  -------------------------------------------------------
  VWAP
  -------------------------------------------------------
  */

  const vwap =
    calculateVWAP(
      candles
    );


  /*
  -------------------------------------------------------
  RSI 14
  -------------------------------------------------------
  */

  const rsi14 =
    calculateRSI(
      candles,
      14
    );


  /*
  -------------------------------------------------------
  S² ENGINE
  -------------------------------------------------------
  */

  const signal =
    calculateS2({

      price:
        state.currentPrice,

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

  state.signal =
    signal;

}


/*
=========================================================
PROCESS NEW LIVE CANDLE
=========================================================

Called whenever Binance WebSocket sends a candle.
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
  -------------------------------------------------------
  ADD / UPDATE LIVE CANDLE
  -------------------------------------------------------
  */

  addCandle(
    marketKey,
    candle
  );


  /*
  -------------------------------------------------------
  RECALCULATE INDICATORS
  -------------------------------------------------------
  */

  updateMarketIndicators(
    marketKey
  );


  /*
  -------------------------------------------------------
  DEBUG INFORMATION
  -------------------------------------------------------
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

    `S²=${state.signal?.action || "WAIT"}`,

    `Score=${state.signal?.score ?? 0}`

  );

}