import React, { useState, useRef, useEffect } from "react";
import { FiMail } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { API } from "../utils/API";

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

  /* ⏱ OTP TIMER */
  useEffect(() => {
    if (otpSent && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [otpSent, timer]);

  /* 🔐 PASSWORD CRITERIA */
  const passwordCriteriaValid = (pwd) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
    return regex.test(pwd);
  };

  /* 📧 SEND OTP */
  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await API.post("/auth/api/v1/admin/forgetPassword", {
        email,
      });

      const msg = response.data?.response?.message || "OTP sent to your email";
      toast.success(msg);

      setOtpSent(true);
      setTimer(60);
    } catch (err) {
      const msg =
        err?.response?.data?.response?.message || "Failed to send OTP";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ✅ VERIFY OTP & RESET PASSWORD */
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
        "Password must be 8+ chars with letter, number & special char"
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/auth/api/v1/admin/verifyPasswordOtp", {
        email,
        otp: fullOtp,
        password,
      });

      const msg =
        response.data?.response?.message || "Password reset successful";

      toast.success(msg);
      setTimeout(() => navigate("/adminLogin"), 2000);
    } catch (err) {
      const msg =
        err?.response?.data?.response?.message || "Invalid OTP or password";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  /* 🔢 OTP CHANGE */
  const handleOtpChange = (e, i) => {
    const val = e.target.value;
    if (!/^[0-9]?$/.test(val)) return;

    const newOtp = [...otp];
    newOtp[i] = val;
    setOtp(newOtp);

    if (val && i < 5) {
      inputRefs.current[i + 1]?.focus();
    }
  };

  /* ⌨️ OTP KEYBOARD HANDLING */
  const handleOtpKeyDown = (e, i) => {
    if (e.key === "Backspace") {
      if (otp[i]) {
        const newOtp = [...otp];
        newOtp[i] = "";
        setOtp(newOtp);
      } else if (i > 0) {
        inputRefs.current[i - 1]?.focus();
      }
    }

    if (e.key === "ArrowLeft" && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }

    if (e.key === "ArrowRight" && i < otp.length - 1) {
      inputRefs.current[i + 1]?.focus();
    }
  };

  /* 📋 OTP PASTE SUPPORT */
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(pasteData)) return;

    const newOtp = [...otp];
    pasteData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });

    setOtp(newOtp);
    inputRefs.current[pasteData.length - 1]?.focus();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex border-4 border-[#d4af37] rounded-3xl overflow-hidden shadow-xl">
        {/* LEFT PANEL */}
        <div className="w-[360px] bg-[#2a0505] flex justify-center items-center p-8">
          <img
            src="/AdminLogo.jpeg"
            alt="Shyam Jewellers"
            className="w-[220px]"
          />
        </div>

        {/* RIGHT PANEL */}
        <div className="w-[400px] bg-[#2a0505] text-white p-6">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            {otpSent ? "Verify OTP" : "Reset Password"}
          </h2>

          {!otpSent ? (
            <form onSubmit={sendOtp}>
              <div className="flex items-center bg-white/10 border rounded-lg p-3 mb-4">
                <FiMail className="text-[#d4af37] mr-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-transparent outline-none text-white w-full"
                  required
                />
              </div>

              <button className="w-full bg-[#d4af37] text-black py-2 rounded-xl">
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
                className="w-full p-3 mb-3 rounded-lg text-black"
              />

              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 mb-3 rounded-lg text-black"
              />

              <div className="flex justify-center gap-2 mb-4">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    ref={(el) => (inputRefs.current[i] = el)}
                    onChange={(e) => handleOtpChange(e, i)}
                    onKeyDown={(e) => handleOtpKeyDown(e, i)}
                    onPaste={handleOtpPaste}
                    className="w-10 h-10 text-center text-black rounded font-bold text-lg"
                  />
                ))}
              </div>

              <button className="w-full bg-[#d4af37] text-black py-2 rounded-xl">
                {loading ? "Verifying..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
