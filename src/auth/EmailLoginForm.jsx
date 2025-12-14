import React, { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { API } from "../utils/API";

const EmailLoginForm = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [verified, setVerified] = useState(false);
  const inputRefs = useRef([]);

  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // ⏱️ Timer logic
  useEffect(() => {
    let interval = null;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  // 📧 Request OTP
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await API.post("/api/v1/auth/logIn", { email });
      const backendMessage =
        res.data?.response?.message || "✅ OTP sent successfully!";
      setOtpSent(true);
      setTimer(60);
      setCanResend(false);
      setMessage(backendMessage);
    } catch (err) {
      const backendError =
        err?.response?.data?.messages?.[0]?.message ||
        "❌ Failed to send OTP. Try again.";
      setMessage(backendError);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Resend OTP
  const handleResendOtp = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await API.post("/api/v1/auth/logIn", { email });
      const backendMessage = res.data?.response?.message || "✅ OTP resent!";
      setMessage(backendMessage);
      setTimer(60);
      setCanResend(false);
    } catch (err) {
      const backendError =
        err?.response?.data?.messages?.[0]?.message ||
        "❌ Failed to resend OTP. Try again.";
      setMessage(backendError);
    } finally {
      setLoading(false);
    }
  };

  // 🔢 Handle OTP input
  const handleOtpChange = (e, index) => {
    const val = e.target.value;
    if (!/^[0-9]?$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    if (val && index < 5) inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // ✅ Submit OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join("");
    setLoading(true);
    setMessage("");

    try {
      const response = await API.post("/api/v1/auth/verify", {
        email,
        otp: fullOtp,
      });

      const backendMessage =
        res.data?.response?.message || "✅ Login successful!";
      const token = res.data?.response?.token;
      const user = res.data?.response?.user;

      if (token) {
        const decoded = jwtDecode(token); // 🔓 Decode the token
        const role = decoded.role || "USER"; // 🔐 Extract the role

        sessionStorage.setItem("authToken", token);
        sessionStorage.setItem("role", role); // ✅ Store role securely

        login(token); // context update

        setVerified(true);
        setMessage(backendMessage);

        // 🔁 Redirect based on role
        if (role === "ADMIN") {
          navigate("/admin/home", {
            state: { toastMessage: backendMessage },
          });
        } else {
          navigate("/", {
            state: { toastMessage: backendMessage },
          });
        }

        if (onSuccess) onSuccess(token, backendMessage);
      }

      if (user) {
        sessionStorage.setItem("userInfo", JSON.stringify(user));
      }
    } catch (err) {
      const backendError =
        err?.response?.data?.messages?.[0]?.message ||
        "❌ OTP verification failed";
      setMessage(backendError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {verified ? (
        <div className="flex justify-center items-center h-64">
          <div className="bg-white border border-green-500 p-6 rounded-xl shadow-md text-center">
            <h2 className="text-2xl font-bold text-green-700 mb-2 animate-bounce">
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
                className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#7c1d1d]"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#7c1d1d] text-white font-semibold py-2 rounded-full hover:bg-[#5e1616] transition disabled:opacity-50"
              >
                {loading ? "Sending..." : "Request OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-4 text-center">
              <p className="text-sm text-gray-700">
                Enter the OTP sent to <strong>{email}</strong>
              </p>
              <div className="flex justify-center gap-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    value={digit}
                    ref={(el) => (inputRefs.current[i] = el)}
                    onChange={(e) => handleOtpChange(e, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    className="w-10 h-10 text-center text-lg border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7c1d1d] outline-none"
                  />
                ))}
              </div>

              <div className="text-sm mt-2 text-gray-600">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-[#7c1d1d] font-semibold hover:underline"
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
                className="w-full bg-[#7c1d1d] text-white font-semibold py-2 rounded-full hover:bg-[#5e1616] transition disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify OTP & Login"}
              </button>
            </form>
          )}
          {message && !verified && (
            <p className="text-sm text-center mt-4 text-gray-700 font-medium">
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default EmailLoginForm;
