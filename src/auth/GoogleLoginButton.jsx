import React from "react";
import { auth } from "../services/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export const GoogleLoginButton = () => {
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User logged in:", user);
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  return (
    <button
      className="bg-blue-500 text-white py-2 px-4 rounded-full mt-3"
      onClick={handleGoogleSignIn}
    >
      Sign in with Google
    </button>
  );
};
