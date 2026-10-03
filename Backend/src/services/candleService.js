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

  // Update existing candle
  if (lastCandle && lastCandle.time === candle.time) {
    candles[candles.length - 1] = candle;
  } else {
    candles.push(candle);
  }

  // Keep only latest candles
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
    console.error(`Market state not found: ${marketKey}`);
    return [];
  }

  try {
    console.log(
      `Loading ${HISTORICAL_CANDLES} historical candles from Bybit for ${symbol}...`
    );

    const url =
      `https://api.bybit.com/v5/market/kline` +
      `?category=linear` +
      `&symbol=${symbol}` +
      `&interval=5` +
      `&limit=${HISTORICAL_CANDLES}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Bybit API returned HTTP ${response.status}`
      );
    }

    const data = await response.json();

    if (data.retCode !== 0) {
      throw new Error(
        `Bybit API error: ${data.retMsg || "Unknown error"}`
      );
    }

    const list = data?.result?.list;

    if (!Array.isArray(list)) {
      throw new Error("Invalid Bybit candle response");
    }

    /*
      Bybit returns candles in reverse chronological order.

      Example:
      newest
      ...
      oldest

      We reverse them so our application stores:

      oldest
      ...
      newest
    */

    const candles = list
      .map((item) => ({
        time: Math.floor(Number(item[0]) / 1000),
        open: Number(item[1]),
        high: Number(item[2]),
        low: Number(item[3]),
        close: Number(item[4]),
        volume: Number(item[5]),
        closed: true
      }))
      .reverse();

    state.candles = candles;

    if (candles.length > 0) {
      state.currentPrice =
        candles[candles.length - 1].close;
    }

    console.log(
      `${symbol} | Bybit loaded ${candles.length} historical candles`
    );

    return candles;
  } catch (error) {
    console.error(
      `Failed to load Bybit historical candles for ${symbol}:`,
      error.message
    );

    return [];
  }
}