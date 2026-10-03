export function calculateEMA(
  candles,
  period
) {
  if (
    !candles ||
    candles.length < period
  ) {
    return null;
  }

  const closes = candles.map(
    (candle) => candle.close
  );

  const multiplier =
    2 / (period + 1);

  let ema = 0;

  for (let i = 0; i < period; i++) {
    ema += closes[i];
  }

  ema /= period;

  for (
    let i = period;
    i < closes.length;
    i++
  ) {
    ema =
      (closes[i] - ema) *
        multiplier +
      ema;
  }

  return ema;
}