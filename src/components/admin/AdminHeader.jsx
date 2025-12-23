import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Search, Pencil, UserPlus, LogOut, KeyRound } from "lucide-react";

import logo from "/logo.jpg";
import defaultAvatar from "../../assets/admin.png";
import { API } from "../../utils/API";
import { showLogoutToast } from "./Logout";
import ChangePassword from "../../pages/admin/ChangePassword";
import EditProfileModal from "../../pages/admin/EditProfile";

export default function AdminHeader() {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [admin, setAdmin] = useState(null);

  const dropdownRef = useRef(null);

  /* 🔐 GET ROLE FROM TOKEN */
  let role = null;
  const token = sessionStorage.getItem("authToken");
  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      role = decoded.role;
    } catch (e) {
      console.error("Token decode error:", e);
    }
  }

  /* ✅ FETCH ADMIN FOR HEADER */
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const email = sessionStorage.getItem("email");
        if (!email) return;

        const res = await API.post("/auth/api/v1/admin/getAdminByEmail", {
          email,
        });

        setAdmin(res.data.response);
      } catch (err) {
        console.error("Admin header fetch failed", err);
      }
    };

    fetchAdmin();
  }, []);

  /* 🔽 CLOSE DROPDOWN ON OUTSIDE CLICK */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex justify-between items-start relative px-4 py-3">
      {/* 🔹 LEFT LOGO */}
      <div className="ml-2 pb-2">
        <Link to="/admin">
          <div className="flex items-center gap-3 cursor-pointer">
            <img src={logo} alt="Logo" className="w-16 h-16 animate-pulse" />
            <div>
              <h1 className="text-4xl font-bold text-[#7c1d1d]">
                Shyam Jewellers
              </h1>
              <p className="text-base italic font-semibold tracking-wide text-[#f5c518]">
                Your system, your control.
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* 🔹 RIGHT SIDE */}
      <div className="flex items-center gap-8 relative">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 rounded-full bg-white shadow-sm outline-none text-sm w-56 text-[#0D1B2A] focus:ring-2 focus:ring-yellow-600"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#0D1B2A]" />
        </div>

        {/* Notification */}
        <div className="relative cursor-pointer">
          <Bell className="h-6 w-6 hover:text-yellow-700 transition" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full" />
        </div>

        {/* 👤 ADMIN AVATAR */}
        <div className="relative">
          <img
            src={
              admin?.imageUrl && admin.imageUrl.trim() !== ""
                ? admin.imageUrl
                : defaultAvatar
            }
            onError={(e) => (e.target.src = defaultAvatar)}
            alt="Admin"
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-14 h-14 rounded-full border-2 border-[#7c1d1d] cursor-pointer hover:scale-105 transition"
          />

          {/* 🔽 DROPDOWN */}
          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-56 bg-white border rounded-xl shadow-xl z-50 p-2 space-y-1 text-sm"
            >
              <button
                onClick={() => navigate("/admin/offers")}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-[#0D1B2A] hover:bg-[#fce8e8] hover:text-[#7c1d1d]"
              >
                <Pencil size={16} /> Offer Section
              </button>

              {role === "SUPER_ADMIN" && (
                <button
                  onClick={() => navigate("/admin/manage-admin")}
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-[#0D1B2A] hover:bg-[#fce8e8] hover:text-[#7c1d1d]"
                >
                  <UserPlus size={16} /> Manage Admin
                </button>
              )}

              <button
                onClick={() => setShowEditModal(true)}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-[#0D1B2A] hover:bg-[#fce8e8] hover:text-[#7c1d1d]"
              >
                <Pencil size={16} /> Edit Profile
              </button>

              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-[#0D1B2A] hover:bg-[#fce8e8] hover:text-[#7c1d1d]"
              >
                <KeyRound size={16} /> Change Password
              </button>

              <button
                onClick={showLogoutToast}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-red-600 hover:bg-[#ffe3e3]"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {showModal && <ChangePassword onClose={() => setShowModal(false)} />}
      {showEditModal && (
        <EditProfileModal onClose={() => setShowEditModal(false)} />
      )}
    </div>
  );
}
