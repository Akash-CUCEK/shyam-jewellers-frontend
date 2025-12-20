import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../context/AuthContext";
import { API } from "../utils/API";

const EmailLoginForm = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [verified, setVerified] = useState(false);

  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  /* ⏱ OTP TIMER */
  useEffect(() => {
    let interval = null;

    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    if (timer === 0) {
      setCanResend(true);
    }

    return () => clearInterval(interval);
  }, [otpSent, timer]);

  /* 📧 REQUEST OTP */
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await API.post("/api/v1/auth/logIn", { email });

      const backendMessage =
        response.data?.response?.message || "✅ OTP sent successfully!";

      setOtpSent(true);
      setTimer(60);
      setCanResend(false);
      setMessage(backendMessage);
    } catch (err) {
      const backendError =
        err?.response?.data?.response?.message ||
        "❌ Failed to send OTP. Try again.";

      setMessage(backendError);
    } finally {
      setLoading(false);
    }
  };

  /* 🔁 RESEND OTP */
  const handleResendOtp = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await API.post("/api/v1/auth/logIn", { email });

      const backendMessage =
        response.data?.response?.message || "✅ OTP resent successfully!";

      setTimer(60);
      setCanResend(false);
      setMessage(backendMessage);
    } catch (err) {
      const backendError =
        err?.response?.data?.response?.message || "❌ Failed to resend OTP.";

      setMessage(backendError);
    } finally {
      setLoading(false);
    }
  };

  /* 🔢 OTP INPUT */
  const handleOtpChange = (e, index) => {
    const val = e.target.value;
    if (!/^[0-9]?$/.test(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  /* ✅ VERIFY OTP */
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const fullOtp = otp.join("");

    try {
      const response = await API.post("/api/v1/auth/verify", {
        email,
        otp: fullOtp,
      });

      const backendMessage =
        response.data?.response?.message || "✅ Login successful!";

      const token = response.data?.response?.token;
      const user = response.data?.response?.user;

      if (!token) throw new Error("Token missing");

      const decoded = jwtDecode(token);
      const role = decoded?.role || "USER";

      sessionStorage.setItem("authToken", token);
      sessionStorage.setItem("role", role);
      if (user) {
        sessionStorage.setItem("userInfo", JSON.stringify(user));
      }

      login(token);
      setVerified(true);
      setMessage(backendMessage);

      if (onSuccess) onSuccess(token, backendMessage);

      if (role === "ADMIN") {
        navigate("/admin/home");
      } else {
        navigate("/");
      }
    } catch (err) {
      const backendError =
        err?.response?.data?.response?.message || "❌ OTP verification failed";

      setMessage(backendError);
    } finally {
      setLoading(false);
    }
  };

  /* 🖥 UI */
  return (
    <div className="w-full">
      {verified ? (
        <div className="flex justify-center items-center h-64">
          <div className="bg-white border border-green-500 p-6 rounded-xl shadow-md text-center">
            <h2 className="text-2xl font-bold text-green-700 animate-bounce">
              {message}
            </h2>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-white rounded-xl shadow-lg w-full max-w-md mx-auto mt-4">
          {!otpSent ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border rounded-full px-4 py-2"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#7c1d1d] text-white py-2 rounded-full"
              >
                {loading ? "Sending..." : "Request OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-4 text-center">
              <p className="text-sm">
                Enter OTP sent to <strong>{email}</strong>
              </p>

              <div className="flex justify-center gap-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    maxLength={1}
                    value={digit}
                    ref={(el) => (inputRefs.current[i] = el)}
                    onChange={(e) => handleOtpChange(e, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    className="w-10 h-10 text-center border rounded-md"
                  />
                ))}
              </div>

              <div className="text-sm text-gray-600">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-[#7c1d1d] font-semibold"
                  >
                    Resend OTP
                  </button>
                ) : (
                  <span>Resend OTP in {timer}s</span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#7c1d1d] text-white py-2 rounded-full"
              >
                {loading ? "Verifying..." : "Verify OTP & Login"}
              </button>
            </form>
          )}

          {message && !verified && (
            <p className="text-center text-sm mt-4">{message}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default EmailLoginForm;
