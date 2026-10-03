export function calculateVWAP(candles) {
  if (!candles?.length) {
    return null;
  }

  let cumulativePV = 0;
  let cumulativeVolume = 0;

  for (const candle of candles) {
    const typicalPrice =
      (candle.high +
        candle.low +
        candle.close) /
      3;

    cumulativePV +=
      typicalPrice * candle.volume;

    cumulativeVolume += candle.volume;
  }

  if (cumulativeVolume === 0) {
    return null;
  }

  return (
    cumulativePV /
    cumulativeVolume
  );
}