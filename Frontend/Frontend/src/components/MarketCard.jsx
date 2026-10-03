function MarketCard({ market, onClick }) {
  return (
    <button className="market-card" onClick={onClick}>
      <div className="market-card-top">
        <div>
          <span className="market-short">
            {market.shortName}
          </span>

          <h3>{market.name}</h3>
        </div>

        <span className="market-connection">
          {market.connected ? "● LIVE" : "○ OFFLINE"}
        </span>
      </div>

      <div className="market-price">
        ${market.price.toLocaleString()}
      </div>

      <div
        className={
          market.change24h >= 0
            ? "positive"
            : "negative"
        }
      >
        {market.change24h >= 0 ? "+" : ""}
        {market.change24h}%
      </div>

      <div className="card-footer">
        Open Market Analysis →
      </div>
    </button>
  );
}

export default MarketCard;