import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import AdminMobileDrawer from "./AdminMobileDrawer";

export default function AdminLayout() {
  const [openMobile, setOpenMobile] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* DESKTOP SIDEBAR */}
      <AdminSidebar />

      {/* MOBILE DRAWER */}
      <AdminMobileDrawer open={openMobile} close={() => setOpenMobile(false)} />

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        <AdminHeader onOpenMobileMenu={() => setOpenMobile(true)} />
        <main className="p-4 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
