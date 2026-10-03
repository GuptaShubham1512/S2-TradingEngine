function PriceHeader({ market, onBack }) {
  return (
    <header className="price-header">
      <button className="back-button" onClick={onBack}>
        ← Markets
      </button>

      <div className="price-market-info">
        <span className="market-symbol">
          {market.displaySymbol}
        </span>

        <h1>
          ${market.price?.toLocaleString() ?? "--"}
        </h1>

        <span
          className={
            market.change24h >= 0
              ? "positive"
              : "negative"
          }
        >
          {market.change24h >= 0 ? "+" : ""}
          {market.change24h}%
        </span>
      </div>

      <div className="connection-badge">
        {market.connected ? "● Connected" : "○ Disconnected"}
      </div>
    </header>
  );
}

export default PriceHeader;