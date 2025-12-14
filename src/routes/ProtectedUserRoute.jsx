import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  const token = sessionStorage.getItem("authToken");
  const role = sessionStorage.getItem("role");

  if (!token || role !== "ADMIN") {
    return <Navigate to="/adminLogin" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
