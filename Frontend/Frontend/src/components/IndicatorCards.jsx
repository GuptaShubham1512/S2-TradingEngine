function IndicatorCards({ indicators }) {
  const data = indicators ?? {};

  const items = [
    {
      name: "EMA 9",
      value: data.ema9
    },
    {
      name: "EMA 20",
      value: data.ema20
    },
    {
      name: "VWAP",
      value: data.vwap
    },
    {
      name: "RSI 14",
      value: data.rsi14
    }
  ];

  return (
    <section className="indicator-section">
      <div className="section-heading">
        <p className="eyebrow">INDICATORS</p>
        <h2>Current Indicator Values</h2>
      </div>

      <div className="indicator-grid">
        {items.map((item) => (
          <div className="indicator-card" key={item.name}>
            <span>{item.name}</span>

            <strong>
              {item.value === null ||
              item.value === undefined
                ? "--"
                : Number(item.value).toFixed(2)}
            </strong>

            <small>
              {item.value == null
                ? "Waiting for backend"
                : "Backend calculated"}
            </small>
          </div>
        ))}
      </div>
    </section>
  );
}

export default IndicatorCards;