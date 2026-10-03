import { marketState } from "../state/marketState.js";

const MAX_CANDLES = 3000;
const CANDLES_PER_REQUEST = 1000;

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
  const allCandles = [];

  let endTime = Date.now();

  for (let request = 0; request < 3; request++) {
    const url =
      `https://data-api.binance.vision/api/v3/klines` +
      `?symbol=${market.symbol}` +
      `&interval=5m` +
      `&limit=${CANDLES_PER_REQUEST}` +
      `&endTime=${endTime}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Failed to load ${market.symbol} candles: ` +
        `${response.status} ${errorText}`
      );
    }

    const data = await response.json();

    if (!data.length) {
      break;
    }

    const candles = data.map((item) => ({
      time: Math.floor(item[0] / 1000),
      open: Number(item[1]),
      high: Number(item[2]),
      low: Number(item[3]),
      close: Number(item[4]),
      volume: Number(item[5]),
      closed: true
    }));

    allCandles.unshift(...candles);

    // Move backwards before the oldest candle
    endTime = data[0][0] - 1;
  }

  // Remove duplicate candles and sort oldest → newest
  const uniqueCandles = Array.from(
    new Map(
      allCandles.map((candle) => [
        candle.time,
        candle
      ])
    ).values()
  ).sort((a, b) => a.time - b.time);

  return uniqueCandles.slice(-MAX_CANDLES);
}