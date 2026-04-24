import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/client";
import "../styles/theme.css";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const endRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      // ✅ FIXED
      const res = await API.get("/chat/history?limit=20");
      setMessages(res.data);
    } catch (err) {
      console.error("History error:", err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;

    setMessages((prev) => [
      ...prev,
      { user_message: userMessage, ai_response: "..." },
    ]);

    setInput("");
    setLoading(true);

    try {
      // ✅ FIXED
      const res = await API.post("/chat/", {
        message: userMessage,
      });

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = res.data;
        return updated;
      });
    } catch (err) {
      console.error("Chat error:", err);

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          user_message: userMessage,
          ai_response: "Error: unable to get response",
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container">
      <div className="sidebar">
        <h3>Chat History</h3>
        <button onClick={logout}>Logout</button>

        {messages.map((m, i) => (
          <div key={i} className="chat-item">
            {m.user_message}
          </div>
        ))}
      </div>

      <div className="chat-box">
        {messages.map((m, i) => (
          <div key={i}>
            <div className="msg user">{m.user_message}</div>
            <div className="msg bot">{m.ai_response}</div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message..."
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
