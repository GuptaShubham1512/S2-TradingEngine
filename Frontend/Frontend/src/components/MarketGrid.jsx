import MarketCard from "./MarketCard";

function MarketGrid({ markets, onSelectMarket }) {
  return (
    <section className="market-section">
      <div className="section-heading">
        <p className="eyebrow">MARKETS</p>
        <h2>Live Market Intelligence</h2>
      </div>

      <div className="market-grid">
        {markets.map((market) => (
          <MarketCard
            key={market.symbol}
            market={market}
            onClick={() => onSelectMarket(market)}
          />
        ))}
      </div>
    </section>
  );
}

export default MarketGrid;