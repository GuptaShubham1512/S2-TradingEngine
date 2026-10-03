function S2SignalBox({
  signal,
  onOpenAnalysis
}) {
  if (!signal) {
    return (
      <section className="s2-box waiting-s2">
        <div>
          <p className="eyebrow">S² ENGINE</p>

          <h2>Waiting for Backend Signal</h2>

          <p>
            The S² Engine will calculate BUY, SELL or WAIT
            using backend indicator values.
          </p>
        </div>

        <div className="s2-score">
          <span>Score</span>
          <strong>--</strong>
        </div>
      </section>
    );
  }

  return (
    <section className="s2-box">
      <div>
        <p className="eyebrow">S² ENGINE</p>

        <h2>{signal.action}</h2>

        <p>{signal.trend}</p>

        <button onClick={onOpenAnalysis}>
          View S² Analysis →
        </button>
      </div>

      <div className="s2-score">
        <span>Score</span>
        <strong>{signal.score}</strong>
      </div>
    </section>
  );
}

export default S2SignalBox;