import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/client";
import "../styles/theme.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * REDIRECT IF ALREADY LOGGED IN
   */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/chat");
  }, [navigate]);

  /**
   * LOGIN HANDLER
   */
  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password required");
      return;
    }

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      const token = res.data?.access_token;

      if (!token) {
        throw new Error("Invalid server response");
      }

      localStorage.setItem("token", token);

      navigate("/chat");
    } catch (err) {
      /**
       * ✅ STRICT ERROR HANDLING (MATCHES INTERCEPTOR)
       */
      switch (err.type) {
        case "TIMEOUT":
          setError("Server timeout. Try again");
          break;

        case "NETWORK_ERROR":
          setError("Cannot connect to server");
          break;

        case "UNAUTHORIZED":
          setError("Invalid credentials");
          break;

        case "FORBIDDEN":
          setError("Access denied");
          break;

        case "SERVER_ERROR":
          setError("Server error. Try later");
          break;

        case "CLIENT_ERROR":
          setError(err.message);
          break;

        default:
          setError(err.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * UI
   */
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
