import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Menu, Pencil, UserPlus, LogOut, KeyRound } from "lucide-react";
import logo from "/logo.jpg";
import defaultAvatar from "../../assets/admin.png";
import { API } from "../../utils/API";
import { showLogoutToast } from "./Logout";
import ChangePassword from "../../pages/admin/ChangePassword";
import EditProfileModal from "../../pages/admin/EditProfile";

export default function AdminHeader({ onOpenMobileMenu }) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [admin, setAdmin] = useState(null);

  const dropdownRef = useRef(null);

  /* ROLE */
  let role = null;
  const token = sessionStorage.getItem("authToken");
  if (token) {
    try {
      role = JSON.parse(atob(token.split(".")[1])).role;
    } catch {}
  }

  /* FETCH ADMIN */
  useEffect(() => {
    const email = sessionStorage.getItem("email");
    if (!email) return;
    API.post("/auth/api/v1/admin/getAdminByEmail", { email }).then((res) =>
      setAdmin(res.data.response)
    );
  }, []);

  /* CLOSE DROPDOWN */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const avatar =
    admin?.imageUrl && admin.imageUrl.trim() !== ""
      ? admin.imageUrl
      : defaultAvatar;

  return (
    <>
      {/* ✅ STICKY + Z-INDEX FIX */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="w-full px-4 py-2 flex items-center justify-between">
          {/* 📱 MOBILE HAMBURGER */}
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 active:scale-95"
          >
            <Menu size={22} />
          </button>

          {/* TITLE / LOGO */}
          <div className="flex-1 text-center md:text-left">
            {/* MOBILE */}
            <h1 className="md:hidden text-lg font-semibold text-[#7c1d1d]">
              Shyam Jewellers
            </h1>

            {/* DESKTOP */}
            <Link to="/admin" className="hidden md:flex items-center gap-2">
              <img src={logo} className="w-12 h-12" />
              <div>
                <h1 className="text-2xl font-bold text-[#7c1d1d]">
                  Shyam Jewellers
                </h1>
                <p className="text-xs italic text-[#f5c518]">
                  Your system, your control.
                </p>
              </div>
            </Link>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3 relative">
            <Bell className="cursor-pointer" />

            <img
              src={avatar}
              onError={(e) => (e.target.src = defaultAvatar)}
              onClick={() => setShowDropdown((p) => !p)}
              className="w-9 h-9 rounded-full border-2 border-[#7c1d1d] cursor-pointer"
            />

            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl p-2 text-sm z-50"
              >
                <button
                  onClick={() => navigate("/admin/offers")}
                  className="flex gap-3 w-full px-3 py-2 hover:bg-[#fce8e8]"
                >
                  <Pencil size={16} /> Offer Section
                </button>

                {role === "SUPER_ADMIN" && (
                  <button
                    onClick={() => navigate("/admin/manage-admin")}
                    className="flex gap-3 w-full px-3 py-2 hover:bg-[#fce8e8]"
                  >
                    <UserPlus size={16} /> Manage Admin
                  </button>
                )}

                <button
                  onClick={() => setShowEditModal(true)}
                  className="flex gap-3 w-full px-3 py-2 hover:bg-[#fce8e8]"
                >
                  <Pencil size={16} /> Edit Profile
                </button>

                <button
                  onClick={() => setShowModal(true)}
                  className="flex gap-3 w-full px-3 py-2 hover:bg-[#fce8e8]"
                >
                  <KeyRound size={16} /> Change Password
                </button>

                <button
                  onClick={showLogoutToast}
                  className="flex gap-3 w-full px-3 py-2 text-red-600 hover:bg-[#ffe3e3]"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {showModal && <ChangePassword onClose={() => setShowModal(false)} />}
      {showEditModal && (
        <EditProfileModal onClose={() => setShowEditModal(false)} />
      )}
    </>
  );
}
