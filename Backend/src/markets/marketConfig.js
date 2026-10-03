export const markets = {
  BTC: {
    key: "BTC",
    symbol: "BTCUSDT",
    name: "Bitcoin",
    shortName: "BTC"
  },

  ETH: {
    key: "ETH",
    symbol: "ETHUSDT",
    name: "Ethereum",
    shortName: "ETH"
  },

  
};

export const getMarketByKey = (key) => {
  return markets[key];
};

export const getMarketBySymbol = (symbol) => {
  return Object.values(markets).find(
    (market) => market.symbol === symbol
  );
};