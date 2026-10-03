export function calculateRSI(
  candles,
  period = 14
) {
  if (
    !candles ||
    candles.length <= period
  ) {
    return null;
  }

  const closes = candles.map(
    (candle) => candle.close
  );

  let gains = 0;
  let losses = 0;

  for (
    let i = 1;
    i <= period;
    i++
  ) {
    const difference =
      closes[i] - closes[i - 1];

    if (difference >= 0) {
      gains += difference;
    } else {
      losses += Math.abs(difference);
    }
  }

  let averageGain =
    gains / period;

  let averageLoss =
    losses / period;

  for (
    let i = period + 1;
    i < closes.length;
    i++
  ) {
    const difference =
      closes[i] - closes[i - 1];

    const gain =
      difference > 0
        ? difference
        : 0;

    const loss =
      difference < 0
        ? Math.abs(difference)
        : 0;

    averageGain =
      (averageGain * (period - 1) +
        gain) /
      period;

    averageLoss =
      (averageLoss * (period - 1) +
        loss) /
      period;
  }

  if (averageLoss === 0) {
    return 100;
  }

  const relativeStrength =
    averageGain / averageLoss;

  return (
    100 -
    100 /
      (1 + relativeStrength)
  );
}