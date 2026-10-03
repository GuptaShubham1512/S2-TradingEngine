import {
  markets
} from "../markets/marketConfig.js";

import {
  loadHistoricalCandles,
  addCandle
} from "./candleService.js";

import {
  calculateEMA
} from "./emaService.js";

import {
  calculateVWAP
} from "./vwapService.js";

import {
  calculateRSI
} from "./rsiService.js";

import {
  calculateS2
} from "./s2Engine.js";

import {
  marketState
} from "../state/marketState.js";

export async function initializeMarkets() {
  for (
    const market of Object.values(markets)
  ) {
    try {
      console.log(
        `Loading ${market.symbol} history...`
      );

      const candles =
        await loadHistoricalCandles(
          market
        );

      for (const candle of candles) {
        addCandle(
          market.key,
          candle
        );
      }

      updateMarketIndicators(
        market.key
      );

      console.log(
        `${market.symbol} initialized`
      );
    } catch (error) {
      console.error(
        `Failed to initialize ${market.symbol}:`,
        error.message
      );
    }
  }
}

export function updateMarketIndicators(
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