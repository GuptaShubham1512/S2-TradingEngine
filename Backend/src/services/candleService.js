import { marketState } from "../state/marketState.js";

const MAX_CANDLES = 1000;

/*
=========================================================
ADD / UPDATE LIVE CANDLE
=========================================================

Candles now come from Binance WebSocket.

If the current candle has the same timestamp,
we update it.

If it is a new candle, we push it.
=========================================================
*/

export function addCandle(
  marketKey,
  candle
) {
  const state = marketState[marketKey];

  if (!state) {
    console.error(
      `Market state not found: ${marketKey}`
    );

    return;
  }

  const candles = state.candles;

  if (!candle) {
    return;
  }

  const lastCandle =
    candles[candles.length - 1];


  /*
  -------------------------------------------------------
  UPDATE EXISTING CANDLE
  -------------------------------------------------------
  */

  if (
    lastCandle &&
    lastCandle.time === candle.time
  ) {
    candles[candles.length - 1] = candle;
  }


  /*
  -------------------------------------------------------
  ADD NEW CANDLE
  -------------------------------------------------------
  */

  else {
    candles.push(candle);
  }


  /*
  -------------------------------------------------------
  KEEP MAXIMUM 1000 CANDLES
  -------------------------------------------------------
  */

  if (
    candles.length > MAX_CANDLES
  ) {
    candles.shift();
  }


  /*
  -------------------------------------------------------
  UPDATE CURRENT PRICE
  -------------------------------------------------------
  */

  state.currentPrice =
    Number(candle.close);
}


/*
=========================================================
GET CANDLE HISTORY
=========================================================

IMPORTANT:

Binance REST historical API has been completely removed.

Previously this function called:

https://data-api.binance.vision/api/v3/klines

That could produce:

HTTP 418
-1003
Too much request weight / IP restriction

We no longer make that request.

Live candles will be collected from:

Binance WebSocket
        ↓
addCandle()
        ↓
marketState
=========================================================
*/

export async function loadHistoricalCandles() {
  return [];
}