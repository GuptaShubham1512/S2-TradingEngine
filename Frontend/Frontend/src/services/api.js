const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

export async function getMarkets() {
  const response =
    await fetch(
      `${API_URL}/api/markets`
    );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch markets"
    );
  }

  return response.json();
}

export async function getMarket(
  market
) {
  const response =
    await fetch(
      `${API_URL}/api/markets/${market}`
    );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch market"
    );
  }

  return response.json();
}

export async function askAI(
  market,
  message
) {
  const response =
    await fetch(
      `${API_URL}/api/ai/${market}/chat`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          message
        })
      }
    );

  if (!response.ok) {
    throw new Error(
      "AI request failed"
    );
  }

  return response.json();
}