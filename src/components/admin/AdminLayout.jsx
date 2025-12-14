import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import RepairModal from "./RepairModal";
import CustomerModal from "./CustomerModal";
import FeedbackModal from "./FeedbackModal";

export default function AdminLayout() {
  const [modalView, setModalView] = useState(null);

  return (
    <>
      <div className="flex">
        <AdminSidebar onOpenModal={(type) => setModalView(type)} />
        <div className="flex-1 p-6">
          <h2 className="text-2xl font-bold text-[#0D1B2A]">
            Welcome to Admin Dashboard
          </h2>
        </div>
      </div>

      {modalView === "repair" && (
        <RepairModal onClose={() => setModalView(null)} />
      )}
      {modalView === "customers" && (
        <CustomerModal onClose={() => setModalView(null)} />
      )}
      {modalView === "feedback" && (
        <FeedbackModal onClose={() => setModalView(null)} />
      )}
    </>
  );
}
