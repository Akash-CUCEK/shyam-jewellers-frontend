import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedAdminRoute = () => {
  const token = sessionStorage.getItem("authToken");
  const role = sessionStorage.getItem("role");

  // Allow forgot-password route publicly
  if (location.pathname === "/admin/forgot-password") {
    return <Outlet />;
  }

  // ✅ Check for both roles
  if (!token || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
    return <Navigate to="/adminLogin" replace />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;
