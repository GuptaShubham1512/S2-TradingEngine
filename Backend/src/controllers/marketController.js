import {
  marketState
} from "../state/marketState.js";

export function getMarkets(
  req,
  res
) {
  const result =
    Object.values(marketState)
      .map(formatMarket);

  res.json(result);
}

export function getMarket(
  req,
  res
) {
  const key =
    req.params.market.toUpperCase();

  const market =
    marketState[key];

  if (!market) {
    return res
      .status(404)
      .json({
        message: "Market not found"
      });
  }

  res.json(
    formatMarket(market)
  );
}

function formatMarket(
  state
) {
  return {
    key: state.key,
    symbol: state.symbol,
    name: state.name,
    shortName: state.shortName,

    price: state.currentPrice,

    indicators:
      state.indicators,

    signal:
      state.signal,

    candles:
      state.candles
  };
}