import { useEffect, useRef } from "react";
import {
  createChart,
  CandlestickSeries,
  LineSeries
} from "lightweight-charts";

function TradingChart({
  market,
  visibleIndicators
}) {
  const mainChartRef = useRef(null);
  const rsiChartRef = useRef(null);

  useEffect(() => {
    if (!mainChartRef.current) return;

    const chart = createChart(mainChartRef.current, {
      width: mainChartRef.current.clientWidth,
      height: 480,

      layout: {
        background: {
          color: "#050505"
        },
        textColor: "#aaaaaa"
      },

      grid: {
        vertLines: {
          color: "#151515"
        },
        horzLines: {
          color: "#151515"
        }
      },

      timeScale: {
        timeVisible: true,
        secondsVisible: false
      }
    });

    const candleSeries = chart.addSeries(
      CandlestickSeries,
      {
        upColor: "#22c55e",
        downColor: "#ef4444",
        borderVisible: false,
        wickUpColor: "#22c55e",
        wickDownColor: "#ef4444"
      }
    );

    const candles = market.candles ?? [];

    candleSeries.setData(
      candles.map((candle) => ({
        time: candle.time,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close
      }))
    );

    /*
      IMPORTANT:

      During frontend-only phase:

      No EMA calculation
      No VWAP calculation
      No RSI calculation
      No S² calculation

      These will be received from backend later.
    */

    chart.timeScale().fitContent();

    const resizeObserver = new ResizeObserver(() => {
      if (mainChartRef.current) {
        chart.applyOptions({
          width: mainChartRef.current.clientWidth
        });
      }
    });

    resizeObserver.observe(mainChartRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [market]);

  useEffect(() => {
    if (!rsiChartRef.current) return;

    const chart = createChart(rsiChartRef.current, {
      width: rsiChartRef.current.clientWidth,
      height: 180,

      layout: {
        background: {
          color: "#050505"
        },
        textColor: "#777777"
      },

      grid: {
        vertLines: {
          color: "#111111"
        },
        horzLines: {
          color: "#111111"
        }
      }
    });

    /*
      RSI will be drawn here after backend integration.

      Frontend does NOT calculate RSI.
    */

    chart.timeScale().fitContent();

    return () => {
      chart.remove();
    };
  }, [market]);

  return (
    <div className="charts-container">
      <div className="chart-card">
        <div className="chart-header">
          <div>
            <h2>{market.displaySymbol}</h2>
            <span>5 Minute Candlestick Chart</span>
          </div>

          <span className="chart-status">
            {market.candles?.length ?? 0} candles
          </span>
        </div>

        <div
          ref={mainChartRef}
          className="main-chart"
        />

        <div className="chart-legend">
          <span>Candles</span>

          <span>
            EMA 9{" "}
            {visibleIndicators.ema9
              ? "•"
              : "○"}
          </span>

          <span>
            EMA 20{" "}
            {visibleIndicators.ema20
              ? "•"
              : "○"}
          </span>

          <span>
            VWAP{" "}
            {visibleIndicators.vwap
              ? "•"
              : "○"}
          </span>
        </div>
      </div>

      <div className="chart-card rsi-card">
        <div className="chart-header">
          <div>
            <h3>RSI 14</h3>
            <span>Momentum panel</span>
          </div>

          <span className="backend-label">
            Backend data
          </span>
        </div>

        <div
          ref={rsiChartRef}
          className="rsi-chart"
        />

        <p className="waiting-text">
          RSI will appear when the backend is connected.
        </p>
      </div>
    </div>
  );
}

export default TradingChart;