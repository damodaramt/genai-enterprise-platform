import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/client";
import "../styles/theme.css";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const login = async () => {
    if (!form.email || !form.password) {
      setError("Email and Password required");
      return;
    }

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      // ✅ DEBUG LOG (IMPORTANT)
      console.log("LOGIN SUCCESS RESPONSE:", res.data);

      // ✅ Validate response
      if (!res?.data?.access_token) {
        throw new Error("Token missing in response");
      }

      // ✅ Store token
      localStorage.setItem("token", res.data.access_token);

      // ✅ Redirect
      navigate("/");

    } catch (err) {
      // 🔴 FULL DEBUG
      console.error("LOGIN ERROR FULL:", err);
      console.error("LOGIN ERROR RESPONSE:", err?.response?.data);

      // ✅ Proper error handling
      if (err.response?.status === 401) {
        setError("Invalid credentials");
      } else if (err.response?.status === 422) {
        setError("Invalid request format");
      } else if (err.response?.status === 404) {
        setError("API endpoint not found");
      } else if (err.message === "Network Error") {
        setError("Backend not reachable");
      } else {
        setError(
          err?.response?.data?.detail ||
          "Server error. Try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back</h2>

        {error && <p className="error">{error}</p>}

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <button onClick={login} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
