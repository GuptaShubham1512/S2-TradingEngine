import { markets } from "../markets/marketConfig.js";

export const marketState = {};

for (const market of Object.values(markets)) {
  marketState[market.key] = {
    key: market.key,
    symbol: market.symbol,
    name: market.name,
    shortName: market.shortName,

    candles: [],

    currentPrice: null,

    change24h: null,

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