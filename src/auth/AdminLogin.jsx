import React, { useState, useRef, useEffect, useContext } from "react";
import { FiMail, FiLock } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../context/AuthContext";
import { API } from "../utils/API";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(60);

  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // 🔁 Timer
  useEffect(() => {
    if (otpSent && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [otpSent, timer]);

  // 📧 Admin Login (Step 1)
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await API.post("/auth/api/v1/admin/logIn", {
        email,
        password,
      });

      setMessage(response.data.response.response);

      setOtpSent(true);
      setTimer(60);
      setCanResend(false);
    } catch (err) {
      setMessage(err?.response?.data?.errors?.[0]?.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Resend OTP
  const handleResendOtp = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await API.post("/auth/api/v1/admin/logIn", {
        email,
        password,
      });
      setMessage(response.data.response.response);
      setTimer(60);
      setCanResend(false);
    } catch (err) {
      setMessage(err?.response?.data?.errors?.[0]?.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔢 Handle OTP Input
  const handleOtpChange = (e, i) => {
    const val = e.target.value;
    if (!/^[0-9]?$/.test(val)) return;

    const newOtp = [...otp];
    newOtp[i] = val;
    setOtp(newOtp);

    if (val && i < 5) inputRefs.current[i + 1].focus();
  };

  const handleOtpKey = (e, i) => {
    if (e.key === "Backspace" && !otp[i] && i > 0)
      inputRefs.current[i - 1].focus();
    else if (e.key === "ArrowLeft" && i > 0) inputRefs.current[i - 1].focus();
    else if (e.key === "ArrowRight" && i < 5) inputRefs.current[i + 1].focus();
  };

  // ✅ OTP Submit
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join("");
    setLoading(true);
    setMessage("");

    try {
      const response = await API.post("/auth/api/v1/admin/verifyOtp", {
        email,
        otp: fullOtp,
      });

      const msg = response?.data?.response?.message || "Login successful!";
      const token = response?.data?.response?.token;

      if (token) {
        const decoded = jwtDecode(token);
        const role = decoded.role || "UNKNOWN";

        sessionStorage.setItem("authToken", token);
        sessionStorage.setItem("role", role);
        sessionStorage.setItem("email", email);

        login(token);
        setVerified(true);
        setMessage(msg);

        const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";
        navigate(isAdmin ? "/admin/home" : "/", {
          state: { toastMessage: msg },
        });
      }
    } catch (err) {
      const errMsg =
        err?.response?.data?.messages?.[0]?.message ||
        "OTP verification failed";
      setMessage(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex border-4 border-[#d4af37] rounded-3xl overflow-hidden shadow-xl">
        {/* Left Logo Panel */}
        <div className="w-[360px] bg-[#2a0505] flex justify-center items-center p-8">
          <img
            src="/AdminLogo.jpeg"
            alt="Shyam Jewellers"
            className="w-[200px] md:w-[240px] drop-shadow-xl animate-pulse"
          />
        </div>

        {/* Right Form Panel */}
        <div className="w-[400px] bg-[#2a0505] text-white flex justify-center items-center p-6">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              {verified ? "Success ✅" : "Welcome Admin"}
            </h2>

            {!otpSent ? (
              <form onSubmit={handleLogin}>
                {/* Email */}
                <div className="flex items-center bg-white/10 border border-white/20 rounded-lg p-3 mb-4">
                  <FiMail className="text-[#d4af37] mr-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="bg-transparent outline-none text-white placeholder-gray-300 w-full"
                    required
                  />
                </div>

                {/* Password */}
                <div className="flex items-center bg-white/10 border border-white/20 rounded-lg p-3 mb-4">
                  <FiLock className="text-[#d4af37] mr-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="bg-transparent outline-none text-white placeholder-gray-300 w-full"
                    required
                  />
                </div>

                <div className="text-right mb-4">
                  <Link
                    to="/admin/forgot-password"
                    className="text-sm text-gray-300 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#d4af37] to-[#f6d776] text-black font-semibold py-2 rounded-xl hover:opacity-90 transition"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="text-center">
                <p className="text-sm text-gray-200 mb-2">
                  Enter OTP sent to <strong>{email}</strong>
                </p>

                <div className="flex justify-center gap-2 mb-4">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      value={digit}
                      ref={(el) => (inputRefs.current[i] = el)}
                      onChange={(e) => handleOtpChange(e, i)}
                      onKeyDown={(e) => handleOtpKey(e, i)}
                      className="w-10 h-10 text-center text-black font-bold text-lg border border-gray-300 rounded-md"
                    />
                  ))}
                </div>

                <div className="text-sm mb-4 text-gray-300">
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-[#d4af37] hover:underline"
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
                  className="w-full bg-gradient-to-r from-[#d4af37] to-[#f6d776] text-black font-semibold py-2 rounded-xl hover:opacity-90 transition"
                >
                  {loading ? "Verifying..." : "Verify & Login"}
                </button>
              </form>
            )}

            {message && (
              <p
                className={`text-sm text-center mt-4 ${
                  verified ? "text-green-400" : "text-yellow-300"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
