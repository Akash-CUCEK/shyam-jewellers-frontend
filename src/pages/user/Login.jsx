import React from "react";
import EmailLoginForm from "../../auth/EmailLoginForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function Login({ onClose }) {
  const handleGoogleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/auth/logIn"
      );
      toast.success("Redirecting to Google login...", {
        duration: 3000,
        position: "top-center",
      });
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Google login failed:", error);
      toast.error("❌ Google login failed. Try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-[#fff8f3] w-[90%] max-w-4xl rounded-xl flex shadow-2xl relative">
        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl text-gray-500 hover:text-red-600"
        >
          ✕
        </button>

        {/* 🎁 Offer Section */}
        <div className="w-1/2 p-6 border-r border-gray-300 hidden md:flex flex-col justify-center items-center text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3213/3213474.png"
            alt="Gift Box"
            className="w-24 mb-4"
          />
          <h3 className="text-xl font-semibold text-[#7c1d1d] mb-2">
            On your first order get
          </h3>
          <div className="text-3xl font-bold text-[#7c1d1d] mb-4">₹500 off</div>
          <p className="text-[#7c1d1d] font-medium">And other benefits</p>
          <div className="mt-3 text-sm text-gray-700 space-y-1">
            <p>❤️ Unlock wishlist</p>
            <p>🎯 Personalized shopping</p>
          </div>
        </div>

        {/* 🔐 Login Form Section */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold mb-4 text-[#7c1d1d]">
            Welcome to Shyama Jewellers!
          </h2>
          <p className="text-sm mb-4 text-gray-600">
            Login via Email OTP or Google
          </p>

          {/* ✅ Email Login + Toast on success */}
          <EmailLoginForm
            onSuccess={(token, message) => {
              toast.success(message || "Login successful 🎉", {
                duration: 5000,
                position: "top-center",
              });
              onClose();
            }}
          />

          {/* 🔘 Google Login */}
          <div className="flex justify-center gap-6 my-4">
            <button
              title="Login with Google"
              onClick={handleGoogleLogin}
              className="text-[#7c1d1d] text-3xl hover:text-[#5e1616] transition-transform hover:scale-110"
            >
              <FontAwesomeIcon icon={faGoogle} />
            </button>
          </div>

          {/* 📝 Disclaimer */}
          <p className="text-xs text-gray-500 mt-4 text-center">
            By continuing, I agree to the{" "}
            <a href="#" className="underline text-[#7c1d1d]">
              Terms of Use
            </a>{" "}
            &{" "}
            <a href="#" className="underline text-[#7c1d1d]">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
