import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL: API_URL,
  withCredentials: true, // 🔥 REQUIRED FOR SET-COOKIE
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
    return Promise.reject(error);
  }
);

export { API };
