import { marketState } from "../state/marketState.js";

const MAX_CANDLES = 500;

export function addCandle(
  marketKey,
  candle
) {
  const state = marketState[marketKey];

  if (!state) return;

  const candles = state.candles;

  const lastCandle =
    candles[candles.length - 1];

  if (
    lastCandle &&
    lastCandle.time === candle.time
  ) {
    candles[candles.length - 1] = candle;
  } else {
    candles.push(candle);
  }

  if (candles.length > MAX_CANDLES) {
    candles.shift();
  }

  state.currentPrice = candle.close;
}

export async function loadHistoricalCandles(
  market
) {
  const url =
    `https://api.binance.com/api/v3/klines` +
    `?symbol=${market.symbol}` +
    `&interval=5m` +
    `&limit=200`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to load ${market.symbol} candles`
    );
  }

  const data = await response.json();

  return data.map((item) => ({
    time: Math.floor(item[0] / 1000),
    open: Number(item[1]),
    high: Number(item[2]),
    low: Number(item[3]),
    close: Number(item[4]),
    volume: Number(item[5]),
    closed: true
  }));
}