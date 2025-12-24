import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../context/AuthContext";
import { API } from "../utils/API";
import { toast } from "react-hot-toast";

const RESEND_TIME = 60; // 1 minute

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(RESEND_TIME);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  /* 🔘 COMMON BUTTON STYLE (FREEZE + FADE) */
  const buttonClass = (disabled) =>
    `w-full py-3 rounded-xl font-semibold transition-all duration-300
     ${
       disabled
         ? "bg-[#5A0F1B]/60 opacity-60 cursor-not-allowed"
         : "bg-[#5A0F1B] hover:bg-[#7A1A25] cursor-pointer"
     } text-white`;

  /* ⏱ TIMER */
  useEffect(() => {
    if (!otpSent) return;

    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
      return () => clearInterval(interval);
    }

    if (timer === 0) {
      setCanResend(true);
    }
  }, [otpSent, timer]);

  /* COMMON ERROR HANDLER */
  const showError = (err) => {
    const messages = err?.response?.data?.errors?.messages;

    if (Array.isArray(messages)) {
      messages.forEach((e) => toast.error(e.message));
    } else {
      toast.error("Something went wrong");
    }
  };

  /* STEP 1 – LOGIN (SEND OTP) */
  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const res = await API.post("/auth/api/v1/admin/logIn", {
        email,
        password,
      });

      toast.success(
        res?.data?.response?.message || res?.data?.response?.response
      );

      setOtpSent(true);
      setTimer(RESEND_TIME);
      setCanResend(false);
      setOtp(new Array(6).fill(""));
    } catch (err) {
      showError(err);
    } finally {
      setLoading(false);
    }
  };

  /* RESEND OTP */
  const handleResendOtp = async () => {
    if (!canResend || loading) return;

    setLoading(true);
    try {
      const res = await API.post("/auth/api/v1/admin/logIn", {
        email,
        password,
      });

      toast.success(
        res?.data?.response?.message || res?.data?.response?.response
      );

      setTimer(RESEND_TIME);
      setCanResend(false);
      setOtp(new Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } catch (err) {
      showError(err);
    } finally {
      setLoading(false);
    }
  };

  /* OTP INPUT CHANGE */
  const handleOtpChange = (e, i) => {
    const val = e.target.value;
    if (!/^[0-9]?$/.test(val)) return;

    const updated = [...otp];
    updated[i] = val;
    setOtp(updated);

    if (val && i < 5) inputRefs.current[i + 1]?.focus();
  };

  /* OTP KEY HANDLING */
  const handleOtpKeyDown = (e, i) => {
    if (e.key === "Backspace") {
      if (otp[i]) {
        const updated = [...otp];
        updated[i] = "";
        setOtp(updated);
      } else if (i > 0) {
        inputRefs.current[i - 1]?.focus();
      }
    }

    if (e.key === "ArrowLeft" && i > 0) inputRefs.current[i - 1]?.focus();

    if (e.key === "ArrowRight" && i < 5) inputRefs.current[i + 1]?.focus();
  };

  /* STEP 2 – VERIFY OTP */
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const res = await API.post("/auth/api/v1/admin/verifyOtp", {
        email,
        otp: otp.join(""),
      });

      const { token, message } = res?.data?.response;
      const decoded = jwtDecode(token);

      sessionStorage.setItem("authToken", token);
      sessionStorage.setItem("role", decoded.role);
      sessionStorage.setItem("email", email);

      login(token);
      toast.success(message);

      setTimeout(() => navigate("/admin/home"), 800);
    } catch (err) {
      showError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* LOGO */}
        <div className="flex justify-center md:justify-start">
          <img
            src="/AdminLogo.jpeg"
            alt="Shyama Jewellers"
            className="w-[200px] object-contain"
          />
        </div>

        {/* LOGIN CARD */}
        <div className="flex justify-center">
          <div className="w-full max-w-sm bg-[#FAF8F4] p-8 rounded-2xl shadow-xl">
            <h1 className="text-center text-2xl font-semibold text-[#5A0F1B]">
              SHYAMA JEWELLERS
            </h1>
            <p className="text-center text-sm text-gray-600 mb-6">
              Admin Access
            </p>

            {!otpSent ? (
              <form onSubmit={handleLogin}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mb-4 px-4 py-3 rounded-lg border"
                  required
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mb-4 px-4 py-3 rounded-lg border"
                  required
                />

                <div className="text-right mb-6">
                  <Link
                    to="/admin/forgot-password"
                    className="text-sm text-[#7A5A2E] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button disabled={loading} className={buttonClass(loading)}>
                  {loading ? "Processing..." : "LOGIN"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="text-center">
                <p className="text-sm mb-4 text-gray-700">
                  Enter OTP sent to {email}
                </p>

                <div className="flex justify-center gap-2 mb-6">
                  {otp.map((d, i) => (
                    <input
                      key={i}
                      maxLength={1}
                      value={d}
                      ref={(el) => (inputRefs.current[i] = el)}
                      onChange={(e) => handleOtpChange(e, i)}
                      onKeyDown={(e) => handleOtpKeyDown(e, i)}
                      className="w-10 h-10 text-center border rounded-md font-bold"
                    />
                  ))}
                </div>

                <button disabled={loading} className={buttonClass(loading)}>
                  {loading ? "Verifying..." : "VERIFY & LOGIN"}
                </button>

                {/* 🔁 RESEND OTP + TIMER */}
                <div className="mt-4">
                  <button
                    type="button"
                    disabled={!canResend || loading}
                    onClick={handleResendOtp}
                    className={`text-sm underline transition ${
                      canResend && !loading
                        ? "text-[#7A5A2E] cursor-pointer"
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Resend OTP
                    {!canResend && (
                      <span className="ml-1">
                        ({String(Math.floor(timer / 60)).padStart(2, "0")}:
                        {String(timer % 60).padStart(2, "0")})
                      </span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
