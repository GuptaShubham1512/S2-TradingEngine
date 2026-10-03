
import { useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

function Chatbot({ market }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userMessage = message.trim();

    if (!userMessage || loading) return;

    // Show user's message immediately
    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        text: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      /*
       * Market key examples:
       * BTC
       * ETH
       * GOLD
       */
      const marketKey =
        market?.key ||
        market?.id ||
        "BTC";

      const response = await fetch(
        `${API_BASE_URL}/api/ai/${marketKey}/chat`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          /*
           * Backend expects:
           * { message: "..." }
           */
          body: JSON.stringify({
            message: userMessage,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            `Backend error: ${response.status}`
        );
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text:
            data.answer ||
            "Gemini returned an empty response.",
        },
      ]);
    } catch (error) {
      console.error("S² AI Error:", error);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text:
            `AI connection error: ${error.message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="chatbot-section">

      <div className="section-heading">

        <p className="eyebrow">
          AI ASSISTANT
        </p>

        <h2>
          Talk to S² AI
        </h2>

        <p>
          Ask questions about{" "}
          {market?.displaySymbol || "the market"}.
        </p>

      </div>

      <div className="chat-window">

        {messages.length === 0 && (
          <div className="chat-empty">

            <span>✦</span>

            <p>
              Ask something like:
              <br />
              "Explain the current S² state."
            </p>

          </div>
        )}

        {messages.map((item, index) => (
          <div
            key={index}
            className={`chat-message ${item.role}`}
          >
            {item.text}
          </div>
        ))}

        {loading && (
          <div className="chat-message assistant">
            S² AI is analyzing the current market state...
          </div>
        )}

      </div>

      <form
        className="chat-input"
        onSubmit={handleSubmit}
      >

        <input
          value={message}
          onChange={(event) =>
            setMessage(event.target.value)
          }
          placeholder="Ask about the market..."
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "..." : "Send"}
        </button>

      </form>

    </section>
  );
}

export default Chatbot;

