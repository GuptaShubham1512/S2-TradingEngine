import { marketState } from "../state/marketState.js";

const MAX_CANDLES = 1000;
const HISTORICAL_CANDLES = 100;

export function addCandle(marketKey, candle) {
  const state = marketState[marketKey];

  if (!state) {
    console.error(`Market state not found: ${marketKey}`);
    return;
  }

  if (!candle) {
    return;
  }

  const candles = state.candles;

  const lastCandle = candles[candles.length - 1];

  if (lastCandle && lastCandle.time === candle.time) {
    candles[candles.length - 1] = candle;
  } else {
    candles.push(candle);
  }

  if (candles.length > MAX_CANDLES) {
    candles.shift();
  }

  state.currentPrice = Number(candle.close);
}

export async function loadHistoricalCandles(
  marketKey,
  symbol
) {
  const state = marketState[marketKey];

  if (!state) {
    console.error(
      `Market state not found: ${marketKey}`
    );

    return [];
  }

  try {
    console.log(
      `Loading ${HISTORICAL_CANDLES} historical candles for ${symbol}...`
    );

    const url =
      `https://api.binance.com/api/v3/klines` +
      `?symbol=${symbol}` +
      `&interval=5m` +
      `&limit=${HISTORICAL_CANDLES}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Binance API returned ${response.status}`
      );
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error(
        "Invalid Binance candle response"
      );
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

    state.candles = candles;

    if (candles.length > 0) {
      state.currentPrice =
        candles[candles.length - 1].close;
    }

    console.log(
      `${symbol} | Loaded ${candles.length} historical candles`
    );

    return candles;
  } catch (error) {
    console.error(
      `Failed to load historical candles for ${symbol}:`,
      error.message
    );

    return [];
  }
}