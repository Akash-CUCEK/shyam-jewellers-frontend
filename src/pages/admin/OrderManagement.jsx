import React, { useState } from "react";
import AddOrderForm from "./AddOrderForm";

const orders = [
  {
    id: "#1235",
    name: "Ali Hasan",
    date: "23/04/2024",
    amount: "₹1,500",
    status: "Shipped",
    avatar: "bg-green-200",
  },
  {
    id: "#1234",
    name: "Sunita Singh",
    date: "23/04/2024",
    amount: "₹2,200",
    status: "Pending",
    avatar: "bg-red-200",
  },
  {
    id: "#1233",
    name: "Raj Patel",
    date: "22/04/2024",
    amount: "₹1,000",
    status: "Shipped",
    avatar: "bg-green-200",
  },
  {
    id: "#1232",
    name: "Zoya Khan",
    date: "20/04/2024",
    amount: "₹3,500",
    status: "Pending",
    avatar: "bg-red-200",
  },
];

export default function OrderManagement() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-6 bg-[#f9f9f9] min-h-screen relative">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-[#7c1d1d]">
          Order Management
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#6e1414] text-[#f1f1f1] px-4 py-2 rounded-md shadow font-bold tracking-wide hover:opacity-90"
        >
          Add Order
        </button>
      </div>

      {/* Search and Icons */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by order ID or customer"
          className="w-full max-w-md p-2 border rounded-md focus:outline-[#7c1d1d]"
        />
        <div className="flex gap-3 ml-4 text-xl text-[#7c1d1d]">
          <span className="cursor-pointer hover:text-[#a31616]">🔽</span>
          <span className="cursor-pointer hover:text-[#a31616]">🔄</span>
          <span className="cursor-pointer hover:text-[#a31616]">📋</span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-left">
          <thead className="bg-[#f1f1f1] text-[#7c1d1d] font-medium">
            <tr>
              <th className="p-3">Order</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Date</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {orders.map((order, idx) => (
              <tr
                key={idx}
                className={`border-b ${
                  idx % 2 !== 0 ? "bg-[#f9eaea]" : "bg-white"
                }`}
              >
                <td className="p-3">{order.id}</td>
                <td className="p-3 flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full ${order.avatar}`}></div>
                  {order.name}
                </td>
                <td className="p-3">{order.date}</td>
                <td className="p-3">{order.amount}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === "Shipped"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-3">⬇️</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-sm text-gray-600 mt-2 px-1">
        <span>Rows per page: 10 ⌄</span>
        <span>1–4 of 4</span>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl max-h-[95vh] overflow-y-auto w-full max-w-5xl p-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-[#7c1d1d]">
                Add New Order
              </h2>
            </div>
            <AddOrderForm onCancel={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
