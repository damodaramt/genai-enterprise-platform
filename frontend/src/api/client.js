import axios from "axios";

/**
 * ✅ PRODUCTION-SAFE CONFIG
 * DO NOT USE import.meta.env (causes build/runtime mismatch in Vercel)
 */
const BASE_URL = "https://damodaram-ai.ddns.net";

console.log("🚀 API BASE URL:", BASE_URL);

/**
 * ✅ Axios instance
 */
const API = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * ✅ Attach JWT token
 */
API.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error("❌ Token read error:", e);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * ✅ Global response handling
 */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔴 Network-level error (request never reached backend)
    if (!error.response) {
      console.error("❌ NETWORK ERROR:", {
        message: error.message,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
      });
      return Promise.reject(error);
    }

    const status = error.response.status;

    // 🔴 Unauthorized
    if (status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    // 🔴 Forbidden
    if (status === 403) {
      console.error("❌ Forbidden:", error.response.data);
    }

    // 🔴 Server error
    if (status >= 500) {
      console.error("❌ Server error:", error.response.data);
    }

    return Promise.reject(error);
  }
);

export default API;
