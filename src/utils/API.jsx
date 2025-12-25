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

// 🔒 Prevent multiple session-expired toasts
let sessionExpiredShown = false;

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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await API.post("/refreshToken");

        const newToken = res?.data?.response?.token;
        if (!newToken) throw new Error("No token");

        sessionStorage.setItem("authToken", newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return API(originalRequest);
      } catch (refreshError) {
        sessionStorage.clear();

        // 🔥 Show toast only once
        if (!sessionExpiredShown) {
          sessionExpiredShown = true;

          toast.custom(
            (t) => (
              <div
                className={`bg-[#0f172a] border border-red-500/30 text-white
                rounded-xl shadow-xl p-5 w-[360px]
                ${t.visible ? "animate-enter" : "animate-leave"}`}
              >
                <h4 className="font-semibold text-red-400 mb-1">
                  🔒 Session Expired
                </h4>

                <p className="text-sm text-gray-300 leading-relaxed">
                  Your session has expired for security reasons.
                  <br />
                  Please login again to continue.
                </p>

                <button
                  onClick={() => {
                    toast.dismiss(t.id);
                    window.location.href = "/login";
                  }}
                  className="mt-4 w-full rounded-lg bg-red-600
                  hover:bg-red-700 py-2 text-sm font-semibold"
                >
                  Login Again
                </button>

                <p className="mt-2 text-xs text-gray-400 text-center">
                  ⏳ Auto redirecting…
                </p>
              </div>
            ),
            { duration: 3000 }
          );

          setTimeout(() => {
            window.location.href = "/login";
          }, 3000);
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { API };
