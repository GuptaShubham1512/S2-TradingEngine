function S2AnalysisPopup({ signal, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="s2-modal">
        <button
          className="modal-close"
          onClick={onClose}
        >
          ×
        </button>

        <p className="eyebrow">
          S² ENGINE ANALYSIS
        </p>

        <h2>
          {signal?.action ?? "WAIT"}
        </h2>

        <div className="modal-score">
          Score: {signal?.score ?? "--"}
        </div>

        <div className="reasons">
          <h3>Reasons</h3>

          {signal?.reasons?.length ? (
            signal.reasons.map((reason, index) => (
              <div className="reason" key={index}>
                <span>✓</span>
                {reason}
              </div>
            ))
          ) : (
            <p>
              Detailed S² reasons will be provided by
              the backend.
            </p>
          )}
        </div>

        <p className="modal-note">
          S² is a deterministic project-defined strategy.
          It does not guarantee future market movement or
          profit.
        </p>
      </div>
    </div>
  );
}

export default S2AnalysisPopup;