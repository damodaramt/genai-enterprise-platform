import axios from "axios";

// ✅ PRODUCTION FIX: force HTTPS backend
const BASE_URL = "https://damodaram-ai.ddns.net";

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach JWT token
API.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error("Token read error:", e);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Global response handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔴 Network / blocked request
    if (!error.response) {
      console.error("Network error:", error.message);
      return Promise.reject(error);
    }

    const status = error.response.status;

    // 🔴 Unauthorized → logout
    if (status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    // 🔴 Forbidden
    if (status === 403) {
      console.error("Forbidden:", error.response.data);
    }

    // 🔴 Server error
    if (status >= 500) {
      console.error("Server error:", error.response.data);
    }

    return Promise.reject(error);
  }
);

export default API;
