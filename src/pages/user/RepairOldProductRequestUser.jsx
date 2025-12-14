import React, { useState, useEffect } from "react";
import RepairOldProductFormUser from "./RepairOldProductFormUser";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  LayoutGrid,
} from "lucide-react";
import Login from "./Login";

const dummyRepairRequests = [
  {
    id: "ROP001",
    item: "Broken Necklace",
    date: "2025-07-02",
    status: "Completed",
    address: "Gaya, Bihar",
  },
  {
    id: "ROP002",
    item: "Bent Ring",
    date: "2025-07-04",
    status: "Pending",
    address: "Patna, Bihar",
  },
];

export default function RepairOldProductRequestUser() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    if (token) setIsLoggedIn(true);
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="text-center py-20">
        <img
          src="/images/login-first.png"
          alt="Login First"
          className="w-40 mx-auto mb-6"
        />
        <h2 className="text-2xl font-bold text-[#7c1d1d]">
          PLEASE LOGIN TO REQUEST REPAIR
        </h2>
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setShowLoginModal(true)}
            className="bg-[#7c1d1d] text-white px-6 py-2 rounded hover:opacity-90 transition"
          >
            Login to Continue
          </button>
        </div>
        {showLoginModal && <Login onClose={() => setShowLoginModal(false)} />}
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#fdf9f4] min-h-screen text-[#2c2c2c]">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-serif font-bold text-[#800000]">
          Your Repair Old Product Requests
        </h1>
        <button
          onClick={() => setShowFormModal(true)}
          className="flex items-center gap-2 bg-[#800000] text-white px-4 py-2 rounded-lg hover:bg-[#a00000] transition"
        >
          <Plus size={18} />
          Request Repair
        </button>
      </div>

      {/* Search, Filter, View */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-full max-w-md bg-white">
          <Search size={18} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search by ID or Item"
            className="w-full outline-none"
          />
        </div>
        <button className="bg-white border p-2 rounded-lg hover:bg-gray-100">
          <Filter size={18} />
        </button>
        <button className="bg-white border p-2 rounded-lg hover:bg-gray-100">
          <LayoutGrid size={18} />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#f1e3da] text-[#4a2c2a] font-semibold">
            <tr>
              <th className="px-4 py-3">Request ID</th>
              <th className="px-4 py-3">Item</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dummyRepairRequests.map((item) => (
              <tr key={item.id} className="border-t hover:bg-[#fff7f3]">
                <td className="px-4 py-3">{item.id}</td>
                <td className="px-4 py-3">{item.item}</td>
                <td className="px-4 py-3">{item.date}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3">{item.address}</td>
                <td className="px-4 py-3 flex justify-center gap-3">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Eye size={18} />
                  </button>
                  {item.status === "Pending" && (
                    <>
                      <button className="text-yellow-600 hover:text-yellow-800">
                        <Edit size={18} />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup Form */}
      {showFormModal && (
        <RepairOldProductFormUser onClose={() => setShowFormModal(false)} />
      )}
    </div>
  );
}
