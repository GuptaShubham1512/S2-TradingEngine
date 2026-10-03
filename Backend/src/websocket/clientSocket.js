import { WebSocketServer, WebSocket } from "ws";

const clients = new Set();

export function setupClientSocket(server) {
  const websocketServer = new WebSocketServer({
    server,
    path: "/ws",
  });

  websocketServer.on("connection", (client) => {
    console.log("Frontend WebSocket connected");

    clients.add(client);

    client.on("close", () => {
      clients.delete(client);
      console.log("Frontend WebSocket disconnected");
    });

    client.on("error", (error) => {
      console.error(
        "Frontend WebSocket error:",
        error.message
      );

      clients.delete(client);
    });
  });

  console.log("Frontend WebSocket server ready at /ws");
}

export function broadcastMarket(marketKey) {
  const message = JSON.stringify({
    type: "MARKET_UPDATE",
    market: marketKey,
  });

  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}