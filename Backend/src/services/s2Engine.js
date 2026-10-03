export function calculateS2({
  price,
  ema9,
  ema20,
  vwap,
  rsi14
}) {
  if (
    price == null ||
    ema9 == null ||
    ema20 == null ||
    vwap == null ||
    rsi14 == null
  ) {
    return {
      action: "WAIT",
      score: 0,
      trend: "NEUTRAL",
      reasons: [
        "Insufficient indicator data"
      ]
    };
  }

  let score = 0;

  const reasons = [];

  /*
    PRICE VS EMA 9
  */

  if (price > ema9) {
    score += 2;

    reasons.push(
      "Price is above EMA 9"
    );
  } else {
    score -= 2;

    reasons.push(
      "Price is below EMA 9"
    );
  }

  /*
    EMA 9 VS EMA 20
  */

  if (ema9 > ema20) {
    score += 2;

    reasons.push(
      "EMA 9 is above EMA 20"
    );
  } else {
    score -= 2;

    reasons.push(
      "EMA 9 is below EMA 20"
    );
  }

  /*
    PRICE VS VWAP
  */

  if (price > vwap) {
    score += 2;

    reasons.push(
      "Price is above VWAP"
    );
  } else {
    score -= 2;

    reasons.push(
      "Price is below VWAP"
    );
  }

  /*
    RSI
  */

  if (rsi14 >= 50 && rsi14 <= 70) {
    score += 1;

    reasons.push(
      "RSI indicates positive momentum"
    );
  } else if (
    rsi14 >= 30 &&
    rsi14 < 50
  ) {
    score -= 1;

    reasons.push(
      "RSI indicates weaker momentum"
    );
  } else if (rsi14 > 70) {
    reasons.push(
      "RSI is in an overbought zone"
    );
  } else {
    reasons.push(
      "RSI is in an oversold zone"
    );
  }

  let action = "WAIT";
  let trend = "NEUTRAL";

  if (score >= 4) {
    action = "BUY";
    trend = "BULLISH";
  } else if (score <= -4) {
    action = "SELL";
    trend = "BEARISH";
  }

  return {
    action,
    score,
    trend,
    reasons
  };
}