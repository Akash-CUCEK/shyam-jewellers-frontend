import { toast } from "react-hot-toast";
import { API } from "../../utils/API";

export const showLogoutToast = () => {
  toast.custom(
    (t) => (
      <div
        className={`bg-white border border-[#7c1d1d] text-[#7c1d1d] rounded-xl shadow-xl p-6 w-80 flex flex-col gap-4 ${
          t.visible ? "animate-enter" : "animate-leave"
        }`}
      >
        <h3 className="text-lg font-semibold text-center">
          Logout Confirmation
        </h3>

        <p className="text-sm text-center">Are you sure you want to log out?</p>

        <div className="flex justify-center gap-4">
          {/* ✅ YES */}
          <button
            onClick={async () => {
              toast.dismiss(t.id);

              const token = sessionStorage.getItem("authToken");

              if (!token) {
                toast.error("Session expired. Please login again.", {
                  duration: 4000,
                  position: "top-center",
                });
                sessionStorage.clear();
                window.location.href = "/adminLogin";
                return;
              }

              try {
                const response = await API.post(
                  "/auth/api/v1/admin/logout",
                  {}, // ❌ BODY EMPTY (IMPORTANT)
                  {
                    headers: {
                      Authorization: `Bearer ${token}`, // ✅ HEADER
                    },
                    withCredentials: true, // ✅ refreshToken cookie
                  }
                );

                const message =
                  response?.data?.response?.message || "Logout successful";

                toast.success(message, {
                  duration: 4000,
                  position: "top-center",
                });

                // ✅ CLEANUP
                sessionStorage.clear();

                setTimeout(() => {
                  window.location.href = "/adminLogin";
                }, 1200);
              } catch (err) {
                const errMsg =
                  err?.response?.data?.messages?.[0]?.message ||
                  "Something went wrong. Please try again.";

                toast.error(errMsg, {
                  duration: 4000,
                  position: "top-center",
                });
              }
            }}
            className="px-4 py-2 rounded bg-[#7c1d1d] text-white hover:bg-[#5e1616] transition-all"
          >
            Yes
          </button>

          {/* ❌ NO */}
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 rounded border border-[#7c1d1d] text-[#7c1d1d] hover:bg-[#fdf3f3] transition-all"
          >
            No
          </button>
        </div>
      </div>
    ),
    {
      position: "top-center",
      duration: 999999,
    }
  );
};
