import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/client";
import "../styles/theme.css";

export default function Chat() {
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  // ✅ Auth Guard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  // ✅ Load History (normalize format)
  const loadHistory = async () => {
    try {
      const res = await API.get("/chat/chat/history/");

      // 🔥 NORMALIZE RESPONSE
      const formatted = res.data.map((item) => ({
        user_message: item.user_message || item.message || "",
        ai_response: item.ai_response || item.response || "",
      }));

      setHistory(formatted);

    } catch (err) {
      console.error("History error:", err);
    }
  };

  // ✅ Send Message (FIXED)
  const sendMessage = async () => {
    if (!message || loading) return;

    setLoading(true);

    const userMsg = { user_message: message };
    setHistory((prev) => [...prev, userMsg]);

    try {
      const res = await API.post("/chat/chat/", { message });

      // 🔥 SAFE RESPONSE PARSING
      const aiText =
        res?.data?.ai_response ||
        res?.data?.response ||
        res?.data?.answer ||
        "No response from server";

      const aiMsg = { ai_response: aiText };

      setHistory((prev) => [...prev, aiMsg]);

    } catch (err) {
      console.error("Chat error:", err);

      setHistory((prev) => [
        ...prev,
        { ai_response: "Error: unable to get response" },
      ]);
    }

    setMessage("");
    setLoading(false);
  };

  // ✅ Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // ✅ Initial load
  useEffect(() => {
    loadHistory();
  }, []);

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar">
        <h3>Chat History</h3>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>

        {history.map((c, i) => (
          <div key={i} className="chat-item">
            {c.user_message}
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1 }}>
        <div className="chat-box">
          {history.map((m, i) => (
            <div key={i}>
              {m.user_message && (
                <div className="msg user">{m.user_message}</div>
              )}
              {m.ai_response && (
                <div className="msg bot">{m.ai_response}</div>
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="input-area">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
          />

          <button onClick={sendMessage} disabled={loading}>
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
