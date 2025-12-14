import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const API_URL = import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL: API_URL,
});

// Endpoints jisme token nahi bhejna (auth-free endpoints)
const noAuthEndpoints = ["/auth/api/v1/login"];

API.interceptors.request.use(
  (config) => {
    // Har request pe requestId bhejna
    config.headers["requestId"] = uuidv4();

    // JWT token add karna except excluded endpoints
    const token = sessionStorage.getItem("authToken"); // ✅ fix

    const isNoAuth = noAuthEndpoints.some((url) => config.url.includes(url));
    if (token && !isNoAuth) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", response);
    return response;
  },
  (error) => {
    // agar token expire ho gya to yaha handle kar sakte hai
    if (error.response?.status === 401) {
      console.error("❌ Unauthorized, token invalid or expired");
      // optional: logout redirect yaha kare
    }
    return Promise.reject(error);
  }
);

export { API };
