function IndicatorOptions({
  visibleIndicators,
  setVisibleIndicators
}) {
  const toggleIndicator = (name) => {
    setVisibleIndicators((previous) => ({
      ...previous,
      [name]: !previous[name]
    }));
  };

  const options = [
    ["ema9", "EMA 9"],
    ["ema20", "EMA 20"],
    ["vwap", "VWAP"],
    ["rsi", "RSI 14"]
  ];

  return (
    <section className="options-section">
      <div className="section-heading">
        <p className="eyebrow">CHART OPTIONS</p>
        <h2>Indicators</h2>
      </div>

      <div className="indicator-options">
        {options.map(([key, label]) => (
          <button
            key={key}
            className={
              visibleIndicators[key]
                ? "indicator-toggle active"
                : "indicator-toggle"
            }
            onClick={() => toggleIndicator(key)}
          >
            <span>
              {visibleIndicators[key] ? "●" : "○"}
            </span>

            {label}
          </button>
        ))}
      </div>

      <p className="option-note">
        These controls only control chart visibility.
        Indicator calculations are performed by the backend.
      </p>
    </section>
  );
}

export default IndicatorOptions;