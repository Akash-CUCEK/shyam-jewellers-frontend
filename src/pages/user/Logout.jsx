import axios from "axios";
import { toast } from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

export const logoutUser = () => {
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
          <button
            onClick={async () => {
              toast.dismiss(t.id);

              const token = sessionStorage.getItem("authToken");
              if (!token) {
                toast.error("No token found!", {
                  duration: 4000,
                  position: "top-center",
                });
                return;
              }

              try {
                const res = await axios.post(
                  "http://localhost:8080/api/v1/auth/logout",
                  { token },
                  { headers: { "Content-Type": "application/json" } }
                );

                const message =
                  res?.data?.response?.message || "✅ Logout successful!";
                console.log("Backend Message:", message);

                toast.success(message, {
                  duration: 4000,
                  position: "top-center",
                });

                // ✅ Only logout if backend succeeds
                sessionStorage.clear();
                window.location.reload();
              } catch (err) {
                const errMsg =
                  err?.response?.data?.messages?.[0]?.message ||
                  "❌ Logout failed";
                console.error("Logout Error:", errMsg);

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

          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 rounded border border-[#7c1d1d] text-[#7c1d1d] hover:bg-[#fdf3f3] transition-all"
          >
            No
          </button>
        </div>
      </div>
    ),
    { position: "top-center", duration: 999999 }
  );
};
