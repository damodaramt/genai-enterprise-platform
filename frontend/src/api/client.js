import axios from "axios";

const API = axios.create({
  baseURL: "http://34.93.50.136:8000", // ✅ clean base
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔴 Request Interceptor (attach JWT)
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

// 🔴 Response Interceptor (handle errors globally)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // 🔴 Unauthorized → force logout
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }

      // 🔴 Server error
      if (error.response.status >= 500) {
        console.error("Server error:", error.response.data);
      }
    } else {
      console.error("Network error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default API;
