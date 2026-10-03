import {
  marketState
} from "../state/marketState.js";

export function getIndicators(
  req,
  res
) {
  const key =
    req.params.market.toUpperCase();

  const state =
    marketState[key];

  if (!state) {
    return res
      .status(404)
      .json({
        message: "Market not found"
      });
  }

  res.json({
    market: key,

    price:
      state.currentPrice,

    indicators:
      state.indicators
  });
}

export function getS2(
  req,
  res
) {
  const key =
    req.params.market.toUpperCase();

  const state =
    marketState[key];

  if (!state) {
    return res
      .status(404)
      .json({
        message: "Market not found"
      });
  }

  res.json({
    market: key,
    signal: state.signal
  });
}