import { markets } from "../data/mockMarkets";

import MarketCard from "./MarketCard";

function MarketDashboard({ onSelectMarket }) {

  return (
    <section className="dashboard">

      <div className="hero">

        <div className="hero-badge">
          S² LIVE MARKET ENGINE
        </div>

        <h1>
          Market Intelligence
        </h1>

        <p>
          Real-time technical analysis powered by
          the S² Indicator Engine.
        </p>

      </div>


      <div className="market-grid">

        {markets.map((market) => (

          <MarketCard
            key={market.id}
            market={market}
            onClick={() =>
              onSelectMarket(market)
            }
          />

        ))}

      </div>

    </section>
  );
}

export default MarketDashboard;