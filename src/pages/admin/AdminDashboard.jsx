import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // ✅ Function to navigate to routes like "/admin/repair-request"
  const handleOpen = (type) => {
    navigate(`/admin/${type}`);
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans text-[#0D1B2A] overflow-y-auto">
      {/* ✅ Pass onOpenModal to AdminSidebar */}
      <AdminSidebar onOpenModal={handleOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="p-6">
          <AdminHeader />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
