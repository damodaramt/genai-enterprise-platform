import axios from "axios";

/**
 * BASE URL
 */
const BASE_URL = "https://damodaram-ai.ddns.net";

/**
 * AXIOS INSTANCE
 */
const API = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * REQUEST INTERCEPTOR
 */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * RESPONSE INTERCEPTOR (FIXED)
 */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    /**
     * 🔴 AXIOS ERROR TYPES
     */
    if (error.code === "ECONNABORTED") {
      return Promise.reject({
        type: "TIMEOUT",
        message: "Request timeout",
      });
    }

    /**
     * 🔴 TRUE NETWORK ERROR
     */
    if (!error.response) {
      return Promise.reject({
        type: "NETWORK_ERROR",
        message: "Network issue or server unreachable",
      });
    }

    const status = error.response.status;

    /**
     * 🔴 AUTH
     */
    if (status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      return Promise.reject({
        type: "UNAUTHORIZED",
        message: "Session expired",
      });
    }

    /**
     * 🔴 FORBIDDEN
     */
    if (status === 403) {
      return Promise.reject({
        type: "FORBIDDEN",
        message: "Access denied",
      });
    }

    /**
     * 🔴 SERVER ERROR
     */
    if (status >= 500) {
      return Promise.reject({
        type: "SERVER_ERROR",
        message: error.response.data?.detail || "Internal server error",
      });
    }

    /**
     * 🔴 CLIENT ERROR
     */
    return Promise.reject({
      type: "CLIENT_ERROR",
      message: error.response.data?.detail || "Request failed",
    });
  }
);

export default API;
