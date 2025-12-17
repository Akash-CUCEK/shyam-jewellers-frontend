import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { FiMail, FiLock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (otpSent && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [otpSent, timer]);

  const passwordCriteriaValid = (pwd) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
    return regex.test(pwd);
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await API.post(
        "/auth/api/v1/admin/forgetPassword",
        { email },
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success(res.data.response.response || "OTP sent to your email");
      setOtpSent(true);
      setTimer(60);
    } catch (err) {
      const msg =
        err?.response?.data?.messages?.[0]?.message || "Failed to send OTP";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join("");

    if (
      !email ||
      !password ||
      !confirmPassword ||
      otp.includes("") ||
      fullOtp.length !== 6
    ) {
      toast.error("Please fill all fields");
      return;
    }

    if (!passwordCriteriaValid(password)) {
      toast.error(
        "Password must be 8+ characters with letter, number, special char"
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post(
        "/auth/api/v1/admin/verifyPasswordOtp",
        { email, otp: fullOtp, password },
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success(res.data.response.response || "Password reset successful");
      setTimeout(() => navigate("/adminLogin"), 3000);
    } catch (err) {
      const msg =
        err?.response?.data?.messages?.[0]?.message ||
        "Invalid OTP or Password";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex border-4 border-[#d4af37] rounded-3xl overflow-hidden shadow-xl">
        <div className="w-[360px] bg-[#2a0505] flex justify-center items-center p-8">
          <img
            src="/AdminLogo.jpeg"
            alt="Shyam Jewellers"
            className="w-[200px] md:w-[240px] drop-shadow-xl animate-pulse"
          />
        </div>

        <div className="w-[400px] bg-[#2a0505] text-white flex justify-center items-center p-6">
          <div className="w-full max-w-sm text-center">
            <h2 className="text-2xl font-semibold mb-6">
              {otpSent ? "Verify OTP" : "Reset Password"}
            </h2>

            {!otpSent ? (
              <form onSubmit={sendOtp}>
                <div className="flex items-center bg-white/10 border border-white/20 rounded-lg p-3 mb-4">
                  <FiMail className="text-[#d4af37] mr-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="bg-transparent outline-none text-white placeholder-gray-300 w-full"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#d4af37] to-[#f6d776] text-black font-semibold py-2 rounded-xl hover:opacity-90 transition"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            ) : (
              <form onSubmit={verifyOtp}>
                <p className="text-sm text-gray-200 mb-4">
                  OTP sent to <strong>{email}</strong>
                </p>

                {/* Password */}
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New Password"
                  className="bg-transparent text-white border border-white/20 rounded-lg p-3 mb-4 w-full"
                  required
                />

                {/* Confirm Password */}
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="bg-transparent text-white border border-white/20 rounded-lg p-3 mb-4 w-full"
                  required
                />

                {/* OTP Label */}
                <p className="text-sm font-medium text-white-700 text-center mb-2">
                  Enter the OTP sent to your email
                </p>

                {/* OTP Inputs */}
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

                {/* Resend Timer / Button */}
                <div className="text-sm text-gray-300 mb-4">
                  {timer > 0 ? (
                    <span>
                      Resend OTP in 00:{timer.toString().padStart(2, "0")}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={sendOtp}
                      className="text-[#d4af37] underline hover:opacity-80"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#d4af37] to-[#f6d776] text-black font-semibold py-2 rounded-xl hover:opacity-90 transition"
                >
                  {loading ? "Sending..." : "Reset Password"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
