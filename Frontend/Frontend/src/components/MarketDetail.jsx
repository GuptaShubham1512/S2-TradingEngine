import { useState } from "react";

import PriceHeader from "./PriceHeader";
import TradingChart from "./TradingChart";
import IndicatorCards from "./IndicatorCards";
import IndicatorOptions from "./IndicatorOptions";
import S2SignalBox from "./S2SignalBox";
import S2AnalysisPopup from "./S2AnalysisPopup";
import Chatbot from "./Chatbot";

function MarketDetail({
  market,
  onBack
}) {
  const [
    visibleIndicators,
    setVisibleIndicators
  ] = useState({
    ema9: true,
    ema20: true,
    vwap: true,
    rsi: true
  });

  const [
    showS2Popup,
    setShowS2Popup
  ] = useState(false);

  return (
    <main className="market-detail">
      <PriceHeader
        market={market}
        onBack={onBack}
      />

      <section className="detail-content">

        <TradingChart
          market={market}
          visibleIndicators={
            visibleIndicators
          }
        />

        <IndicatorCards
          indicators={
            market.indicators
          }
        />

        <IndicatorOptions
          visibleIndicators={
            visibleIndicators
          }
          setVisibleIndicators={
            setVisibleIndicators
          }
        />

        <S2SignalBox
          signal={market.signal}
          onOpenAnalysis={() =>
            setShowS2Popup(true)
          }
        />

        <Chatbot
          market={market}
        />

      </section>

      {showS2Popup && (
        <S2AnalysisPopup
          signal={market.signal}
          onClose={() =>
            setShowS2Popup(false)
          }
        />
      )}
    </main>
  );
}

export default MarketDetail;