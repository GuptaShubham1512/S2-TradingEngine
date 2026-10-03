const WS_URL =
  import.meta.env.VITE_WS_URL ||
  "ws://localhost:5000/ws";

export function connectMarketSocket(
  onMessage
) {
  const socket =
    new WebSocket(WS_URL);

  socket.onopen = () => {
    console.log(
      "Connected to backend WebSocket"
    );
  };

  socket.onmessage = (event) => {
    try {
      const data =
        JSON.parse(event.data);

      onMessage(data);
    } catch (error) {
      console.error(
        "WebSocket message error:",
        error
      );
    }
  };

  socket.onerror = (error) => {
    console.error(
      "WebSocket error:",
      error
    );
  };

  socket.onclose = () => {
    console.log(
      "Backend WebSocket disconnected"
    );
  };

  return socket;
}