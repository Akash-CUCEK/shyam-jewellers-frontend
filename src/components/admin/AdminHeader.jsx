import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Search, Pencil, UserPlus, LogOut, KeyRound } from "lucide-react";
import adminAvatar from "../../assets/admin.png";
import logo from "/logo.jpg";
import { showLogoutToast } from "./Logout";
import ChangePassword from "../../pages/admin/ChangePassword";
import EditProfileModal from "../../pages/admin/EditProfile";

export default function AdminHeader() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const dropdownRef = useRef(null);

  // ✅ Get role from token
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex justify-between items-start relative px-4 py-3">
      {/* 🔹 Left: Logo + Name + Tagline */}
      <div className="ml-2 pb-2">
        <Link to="/admin">
          <div className="flex items-center gap-3 relative cursor-pointer">
            <img src={logo} alt="Logo" className="w-16 h-16 animate-pulse" />
            <div className="relative">
              <h1 className="text-4xl font-bold text-[#7c1d1d]">
                Shyam Jewellers
              </h1>
              <p className="text-base italic font-semibold tracking-wide absolute left-1/2 transform -translate-x-1/2 mt-1 whitespace-nowrap text-[#f5c518]">
                Your system, your control.
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* 🔹 Right: Search + Notification + Avatar Dropdown */}
      <div className="flex items-center gap-8 relative">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 rounded-full bg-white shadow-sm outline-none text-sm w-56 text-[#0D1B2A] placeholder-[#0D1B2A] focus:ring-2 focus:ring-yellow-600"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#0D1B2A]" />
        </div>

        {/* Notification */}
        <div className="relative cursor-pointer">
          <Bell className="text-[#0D1B2A] h-6 w-6 hover:text-yellow-700 transition" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full" />
        </div>

        {/* Avatar Dropdown */}
        <div className="relative">
          <img
            src={adminAvatar}
            alt="Admin"
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-14 h-14 rounded-full border-2 border-[#7c1d1d] hover:scale-105 transition-transform cursor-pointer"
          />
          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-52 bg-white border rounded-xl shadow-xl z-50 p-2 space-y-1 text-sm"
            >
              <button
                onClick={() => {
                  navigate("/admin/offers");
                  setShowDropdown(false);
                }}
                className="flex items-center gap-2 text-[#0D1B2A] w-full hover:bg-[#fce8e8] hover:text-[#7c1d1d] px-3 py-2 rounded transition"
              >
                <Pencil size={16} /> Offer Section
              </button>

              {/* ✅ Show only if SUPER_ADMIN */}
              {role === "SUPER_ADMIN" && (
                <button
                  onClick={() => {
                    navigate("/admin/manage-admin");
                    setShowDropdown(false);
                  }}
                  className="flex items-center gap-2 text-[#0D1B2A] w-full hover:bg-[#fce8e8] hover:text-[#7c1d1d] px-3 py-2 rounded transition"
                >
                  <UserPlus size={16} /> Manage Admin
                </button>
              )}

              <button
                onClick={() => {
                  setShowEditModal(true);
                  setShowDropdown(false);
                }}
                className="flex items-center gap-2 text-[#0D1B2A] w-full hover:bg-[#fce8e8] hover:text-[#7c1d1d] px-3 py-2 rounded transition"
              >
                <Pencil size={16} /> Edit Profile
              </button>

              <button
                onClick={() => {
                  setShowModal(true);
                  setShowDropdown(false);
                }}
                className="flex items-center gap-2 text-[#0D1B2A] w-full hover:bg-[#fce8e8] hover:text-[#7c1d1d] px-3 py-2 rounded transition"
              >
                <KeyRound size={16} /> Change Password
              </button>

              <button
                onClick={() => {
                  showLogoutToast();
                  setShowDropdown(false);
                }}
                className="flex items-center gap-2 text-[#0D1B2A] w-full hover:bg-[#ffe3e3] hover:text-[#b30000] px-3 py-2 rounded transition"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 🔹 Modals */}
      {showModal && <ChangePassword onClose={() => setShowModal(false)} />}
      {showEditModal && (
        <EditProfileModal onClose={() => setShowEditModal(false)} />
      )}
    </div>
  );
}
