const WS_URL =
  import.meta.env.VITE_WS_URL ||
  "wss://s2-tradingengine-6.onrender.com/ws";


export function connectMarketSocket(
  onMessage
) {

  console.log(
    "Connecting to S² Backend WebSocket:",
    WS_URL
  );

  const socket =
    new WebSocket(WS_URL);


  /*
  ========================================================
  CONNECTION OPEN
  ========================================================
  */

  socket.onopen = () => {

    console.log(
      "Connected to S² backend WebSocket"
    );

  };


  /*
  ========================================================
  RECEIVE MARKET UPDATE
  ========================================================
  */

  socket.onmessage = (event) => {

    try {

      const data =
        JSON.parse(
          event.data
        );

      console.log(
        "Market update received:",
        data
      );

      onMessage(data);

    } catch (error) {

      console.error(
        "WebSocket message parsing error:",
        error
      );

    }

  };


  /*
  ========================================================
  WEBSOCKET ERROR
  ========================================================
  */

  socket.onerror = (error) => {

    console.error(
      "S² backend WebSocket error:",
      error
    );

  };


  /*
  ========================================================
  CONNECTION CLOSED
  ========================================================
  */

  socket.onclose = (
    event
  ) => {

    console.log(
      "S² backend WebSocket disconnected",
      {
        code: event.code,
        reason: event.reason
      }
    );

  };


  return socket;
}