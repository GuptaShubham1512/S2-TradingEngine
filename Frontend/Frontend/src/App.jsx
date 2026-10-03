import { useCallback, useEffect, useState } from "react";

import MarketGrid from "./components/MarketGrid";
import MarketDetail from "./components/MarketDetail";

import { getMarkets } from "./services/api";
import { connectMarketSocket } from "./services/websocket";

import "./index.css";

/* =========================================================
   ANIMATED BACKGROUND
========================================================= */

function AnimatedBackground() {
  return (
    <div className="animated-background" aria-hidden="true">

      {/* Ambient nebula lights */}
      <div className="nebula nebula-1"></div>
      <div className="nebula nebula-2"></div>
      <div className="nebula nebula-3"></div>

      {/* Star layers */}
      <div className="stars stars-small"></div>
      <div className="stars stars-medium"></div>
      <div className="stars stars-large"></div>

      {/* Shooting stars */}
      <div className="shooting-star shooting-star-1"></div>
      <div className="shooting-star shooting-star-2"></div>
      <div className="shooting-star shooting-star-3"></div>

      {/* Floating glass crystals */}
      <div className="crystal crystal-1">
        <span></span>
      </div>

      <div className="crystal crystal-2">
        <span></span>
      </div>

      <div className="crystal crystal-3">
        <span></span>
      </div>

      <div className="crystal crystal-4">
        <span></span>
      </div>

      <div className="crystal crystal-5">
        <span></span>
      </div>

      <div className="crystal crystal-6">
        <span></span>
      </div>

      {/* Subtle trading symbols */}
      <div className="market-symbol symbol-1">↗</div>
      <div className="market-symbol symbol-2">↘</div>
      <div className="market-symbol symbol-3">₿</div>
      <div className="market-symbol symbol-4">$</div>
      <div className="market-symbol symbol-5">%</div>

      <div className="market-symbol symbol-6">EMA</div>
      <div className="market-symbol symbol-7">RSI</div>
      <div className="market-symbol symbol-8">VWAP</div>

      {/* Grid overlay */}
      <div className="background-grid"></div>
    </div>
  );
}

/* =========================================================
   LOADING SCREEN
========================================================= */

function LoadingScreen() {
  return (
    <div className="app-loading">
      <div className="loading-orbit">
        <div className="loading-core"></div>
      </div>

      <p>Connecting to S² Market Intelligence...</p>

      <span>
        Loading live market data
      </span>
    </div>
  );
}

/* =========================================================
   ERROR SCREEN
========================================================= */

function ErrorScreen({ error, onRetry }) {
  return (
    <div className="app-error">

      <div className="error-icon">
        !
      </div>

      <h2>
        Market connection unavailable
      </h2>

      <p>
        Unable to load live market data from the S² backend.
      </p>

      <small>
        {error}
      </small>

      <button
        className="retry-button"
        onClick={onRetry}
      >
        Retry Connection
      </button>

    </div>
  );
}

/* =========================================================
   MAIN APP
========================================================= */

function App() {

  const [markets, setMarkets] = useState([]);

  const [selectedMarket, setSelectedMarket] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  const [backendConnected, setBackendConnected] =
    useState(false);

  /* =======================================================
     LOAD MARKETS FROM BACKEND
  ======================================================= */

  const loadMarkets = useCallback(async () => {

    try {

      setError(null);

      const response = await getMarkets();

      /*
       * Backend may return:
       *
       * [
       *   {...},
       *   {...}
       * ]
       *
       * OR
       *
       * {
       *   BTC: {...},
       *   ETH: {...},
       *   GOLD: {...}
       * }
       *
       * Handle both formats.
       */

      let marketList = [];

      if (Array.isArray(response)) {

        marketList = response;

      } else if (
        response &&
        typeof response === "object"
      ) {

        /*
         * If API returns:
         * { markets: [...] }
         */

        if (Array.isArray(response.markets)) {

          marketList = response.markets;

        } else {

          /*
           * If API returns an object keyed by market.
           */

          marketList =
            Object.values(response);
        }
      }

      setMarkets(marketList);

      setBackendConnected(true);

    } catch (err) {

      console.error(
        "Failed to load markets:",
        err
      );

      setBackendConnected(false);

      setError(
        err?.message ||
        "Unable to connect to backend"
      );

    } finally {

      setLoading(false);
    }

  }, []);

  /* =======================================================
     INITIAL BACKEND CONNECTION
  ======================================================= */

  useEffect(() => {

    loadMarkets();

  }, [loadMarkets]);

  /* =======================================================
     BACKEND WEBSOCKET
  ======================================================= */

  useEffect(() => {

    let socket;

    try {

      socket = connectMarketSocket(
        async (message) => {

          console.log(
            "Backend WebSocket update:",
            message
          );

          setBackendConnected(true);

          /*
           * Backend currently sends:
           *
           * {
           *   type: "MARKET_UPDATE",
           *   market: "BTC"
           * }
           *
           * We don't calculate anything here.
           *
           * Backend remains responsible for:
           *
           * EMA9
           * EMA20
           * VWAP
           * RSI14
           * S² score
           * BUY / SELL / WAIT
           */

          if (
            message?.type ===
            "MARKET_UPDATE"
          ) {

            await loadMarkets();
          }
        }
      );

    } catch (err) {

      console.error(
        "WebSocket connection failed:",
        err
      );

      setBackendConnected(false);
    }

    /* =====================================================
       CLEANUP
    ===================================================== */

    return () => {

      if (
        socket &&
        typeof socket.close === "function"
      ) {

        socket.close();
      }
    };

  }, [loadMarkets]);

  /* =======================================================
     SELECTED MARKET UPDATE
  ======================================================= */

  useEffect(() => {

    if (!selectedMarket) {
      return;
    }

    const updatedMarket =
      markets.find(
        (market) =>
          market.symbol ===
          selectedMarket.symbol
      );

    if (updatedMarket) {

      setSelectedMarket(updatedMarket);
    }

  }, [markets]);

  /* =======================================================
     RETRY
  ======================================================= */

  const handleRetry = async () => {

    setLoading(true);
    setError(null);

    await loadMarkets();
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {

    return (
      <div className="app-wrapper">

        <AnimatedBackground />

        <div className="app-content">

          <LoadingScreen />

        </div>

      </div>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (
    error &&
    markets.length === 0
  ) {

    return (
      <div className="app-wrapper">

        <AnimatedBackground />

        <div className="app-content">

          <ErrorScreen
            error={error}
            onRetry={handleRetry}
          />

        </div>

      </div>
    );
  }

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <div className="app-wrapper">

      <AnimatedBackground />

      <div className="app-content">

        {selectedMarket ? (

          /* =================================================
             MARKET DETAIL
          ================================================= */

          <MarketDetail
            market={selectedMarket}
            onBack={() =>
              setSelectedMarket(null)
            }
          />

        ) : (

          /* =================================================
             MARKET DASHBOARD
          ================================================= */

          <main className="app">

            {/* ===============================================
               HERO
            =============================================== */}

            <header className="hero">

              <div className="hero-content">

                <div className="hero-badge">

                  <span
                    className="hero-badge-dot"
                  ></span>

                  LIVE MARKET INTELLIGENCE

                </div>

                <p className="eyebrow">
                  S² TRADING INTELLIGENCE
                </p>

                <h1>
                  S² Strategy
                  <span> Engine</span>
                </h1>

                <p className="hero-description">

                  Multi-market trading intelligence
                  dashboard for BTC, ETH and Gold
                  proxy markets.

                </p>

                <div className="hero-line">

                  <span></span>
                  <span></span>
                  <span></span>

                </div>

              </div>

              {/* =============================================
                 SYSTEM STATUS
              ============================================= */}

              <div className="system-status">

                <span
                  className={`status-dot ${
                    backendConnected
                      ? "connected"
                      : ""
                  }`}
                ></span>

                <span>
                  S² Backend
                </span>

                <span className="status-divider"></span>

                <span
                  className={
                    backendConnected
                      ? "status-live"
                      : ""
                  }
                >
                  {backendConnected
                    ? "ONLINE"
                    : "CONNECTING"}
                </span>

              </div>

            </header>

            {/* ===============================================
               MARKET GRID
            =============================================== */}

            <section className="market-section">

              <div className="section-heading">

                <div>

                  <span className="section-kicker">
                    MARKET OVERVIEW
                  </span>

                  <h2>
                    Tracked Markets
                  </h2>

                </div>

                <span className="market-count">

                  {markets.length} MARKETS

                </span>

              </div>

              <MarketGrid
                markets={markets}
                onSelectMarket={
                  setSelectedMarket
                }
              />

            </section>

          </main>
        )}

      </div>

    </div>
  );
}

export default App;