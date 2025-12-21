import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// ✅ CREATE AXIOS INSTANCE
const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// =======================
// RESPONSE INTERCEPTOR
// =======================
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/refreshToken")
    ) {
      originalRequest._retry = true;

      try {
        const res = await API.post("/refreshToken");
        const newToken = res.data.response.accessToken;

        sessionStorage.setItem("authToken", newToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return API(originalRequest);
      } catch (refreshError) {
        const role = sessionStorage.getItem("role");
        sessionStorage.clear();

        if (role === "ADMIN" || role === "SUPER_ADMIN") {
          window.location.href = "/adminLogin";
        } else {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

// ✅ THIS LINE WAS MISSING
export { API };
