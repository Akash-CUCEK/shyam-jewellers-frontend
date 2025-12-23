import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL: API_URL,
});

const noAuthEndpoints = ["/auth/api/v1/login"];

API.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("authToken");

    const isNoAuth = noAuthEndpoints.some((url) => config.url?.includes(url));

    if (token && !isNoAuth) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error("❌ Unauthorized, token invalid or expired");
    }
    return Promise.reject(error);
  }
);

export { API };
