import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const noAuthEndpoints = [
  "/auth/api/v1/login",
  "/auth/api/v1/verifyOtp",
  "/refreshToken",
  "/api/v1/auth/logIn",
  "/api/v1/auth/verify",
];

// 🔐 GLOBAL LOCKS
let isRefreshing = false;
let refreshSubscribers = [];
let sessionExpiredShown = false;

// 🔁 Queue helpers
function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(newToken) {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
}

API.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("authToken");

    const isNoAuth = noAuthEndpoints.some((url) => config.url?.includes(url));

    if (token && !isNoAuth) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !noAuthEndpoints.some((url) => originalRequest.url?.includes(url))
    ) {
      originalRequest._retry = true;

      // 🔒 If refresh already in progress → wait
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(API(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const res = await API.post("/refreshToken");

        const newToken = res?.data?.response?.accessToken;
        if (!newToken) throw new Error("Refresh failed");

        sessionStorage.setItem("authToken", newToken);
        isRefreshing = false;

        onRefreshed(newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return API(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        refreshSubscribers = [];
        sessionStorage.clear();

        if (!sessionExpiredShown) {
          sessionExpiredShown = true;

          toast.error("🔒 Session expired. Please login again.", {
            position: "top-center",
            duration: 4000,
          });

          setTimeout(() => {
            const currentPath = window.location.pathname;

            if (currentPath.startsWith("/admin")) {
              window.location.href = "/adminLogin";
            } else {
              window.location.href = "/login";
            }
          }, 2000);
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { API };
