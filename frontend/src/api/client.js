import axios from "axios";

/**
 * BASE URL FROM ENV
 */
const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  throw new Error("VITE_API_URL is not defined");
}

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
 * RESPONSE INTERCEPTOR
 */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      return Promise.reject({
        type: "TIMEOUT",
        message: "Request timeout",
      });
    }

    if (!error.response) {
      return Promise.reject({
        type: "NETWORK_ERROR",
        message: "Network issue or server unreachable",
      });
    }

    const status = error.response.status;

    if (status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      return Promise.reject({
        type: "UNAUTHORIZED",
        message: "Session expired",
      });
    }

    if (status === 403) {
      return Promise.reject({
        type: "FORBIDDEN",
        message: "Access denied",
      });
    }

    if (status >= 500) {
      return Promise.reject({
        type: "SERVER_ERROR",
        message: error.response.data?.detail || "Internal server error",
      });
    }

    return Promise.reject({
      type: "CLIENT_ERROR",
      message: error.response.data?.detail || "Request failed",
    });
  }
);

export default API;
