import http from "http";

import app from "./app.js";

import {
  config
} from "./config/config.js";

import {
  initializeMarkets
} from "./services/marketInitializer.js";

import {
  setupClientSocket
} from "./websocket/clientSocket.js";

import {
  startBinanceSocket
} from "./websocket/binanceSocket.js";

const server =
  http.createServer(app);

setupClientSocket(
  server
);

async function startServer() {
  try {
    await initializeMarkets();

    startBinanceSocket();

    server.listen(
      config.port,
      () => {
        console.log(
          `S² Backend running on http://localhost:${config.port}`
        );

        console.log(
          `Frontend WebSocket: ws://localhost:${config.port}/ws`
        );
      }
    );
  } catch (error) {
    console.error(
      "Server startup failed:",
      error
    );
  }
}

startServer();