import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { API } from "../utils/API";

const RESEND_TIME = 60; // 1 minute

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(RESEND_TIME);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);
  const navigate = useNavigate();

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

  /* PASSWORD RULE */
  const isValidPassword = (pwd) =>
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(pwd);

  /* 🔥 SAME AS ADMIN LOGIN — ERROR HANDLER (LOOP) */
  const showError = (err) => {
    const messages = err?.response?.data?.errors?.messages;

    if (Array.isArray(messages)) {
      messages.forEach((e) => toast.error(e.message));
    } else {
      toast.error("Something went wrong");
    }
  };

  /* 🔥 SAME AS ADMIN LOGIN — SUCCESS HANDLER */
  const showSuccess = (res) => {
    const msg = res?.data?.response?.message || res?.data?.response?.response;

    if (msg) toast.success(msg);
  };

  /* SEND OTP */
  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/api/v1/admin/forgetPassword", {
        email,
      });

      showSuccess(res);

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
    if (!canResend) return;

    setLoading(true);
    try {
      const res = await API.post("/auth/api/v1/admin/forgetPassword", {
        email,
      });

      showSuccess(res);

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

  /* VERIFY OTP & RESET PASSWORD */
  const verifyOtp = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join("");

    if (!isValidPassword(password)) {
      toast.error(
        "Password must be 8+ chars with letter, number & special character"
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/api/v1/admin/verifyPasswordOtp", {
        email,
        otp: fullOtp,
        password,
      });

      showSuccess(res);

      // ✅ SUCCESS KE BAAD ADMIN LOGIN PAGE
      setTimeout(() => navigate("/adminLogin"), 1200);
    } catch (err) {
      showError(err);
    } finally {
      setLoading(false);
    }
  };

  /* OTP INPUT */
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

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* LOGO */}
        <div className="flex justify-center md:justify-start md:pl-6">
          <img
            src="/AdminLogo.jpeg"
            alt="Shyama Jewellers"
            className="w-[200px] object-contain"
          />
        </div>

        {/* CARD */}
        <div className="flex justify-center md:justify-start">
          <div className="w-full max-w-sm bg-[#FAF8F4] p-8 rounded-2xl shadow-xl">
            <h1 className="text-center text-2xl font-semibold text-[#5A0F1B]">
              {otpSent ? "Verify OTP" : "Reset Password"}
            </h1>
            <p className="text-center text-sm text-gray-600 mb-6">
              Admin Access
            </p>

            {!otpSent ? (
              <form onSubmit={sendOtp}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mb-4 px-4 py-3 rounded-lg border"
                  required
                />

                <button
                  disabled={loading}
                  className="w-full bg-[#5A0F1B] text-white py-3 rounded-xl font-semibold"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            ) : (
              <form onSubmit={verifyOtp}>
                <input
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mb-3 px-4 py-3 rounded-lg border"
                />

                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full mb-4 px-4 py-3 rounded-lg border"
                />

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

                <button
                  disabled={loading}
                  className="w-full bg-[#5A0F1B] text-white py-3 rounded-xl font-semibold"
                >
                  {loading ? "Verifying..." : "Reset Password"}
                </button>

                {/* 🔁 RESEND OTP + TIMER */}
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    disabled={!canResend || loading}
                    onClick={handleResendOtp}
                    className={`text-sm underline transition ${
                      canResend
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
