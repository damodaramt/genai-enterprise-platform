import axios from "axios";

// ✅ Base URL from environment (Vercel-safe)
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request Interceptor (attach JWT)
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor (global error handling)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔴 Network error (backend unreachable)
    if (!error.response) {
      console.error("Network error:", error.message);
      return Promise.reject(error);
    }

    const status = error.response.status;

    // 🔴 Unauthorized → force logout
    if (status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    // 🔴 Server error
    if (status >= 500) {
      console.error("Server error:", error.response.data);
    }

    return Promise.reject(error);
  }
);

export default API;
