import React, { useEffect, useState } from "react";
import AddOrderForm from "./AddOrderForm";
import EditOrderModal from "./EditOrderModal";
import { API } from "../../utils/API";
import { downloadInvoicePdf } from "../../utils/downloadInvoicePdf";

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showAdd, setShowAdd] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.post("/getAllOrder");

      // ✅ backend mapping fix
      const list = res?.data?.response?.getOrderByDateResponseDTOList || [];

      setOrders(list);
    } catch (e) {
      console.error("❌ Fetch orders failed", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-[#f9f9f9] min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-[#7c1d1d]">
          Order Management
        </h1>

        <button
          onClick={() => setShowAdd(true)}
          className="bg-[#6e1414] text-white px-4 py-2 rounded font-bold"
        >
          Add Order
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#f1f1f1] text-[#7c1d1d] font-medium">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Date</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="6" className="p-4 text-center">
                  Loading orders...
                </td>
              </tr>
            )}

            {!loading && orders.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center">
                  No orders found
                </td>
              </tr>
            )}

            {!loading &&
              orders.map((o, i) => (
                <tr
                  key={o.id}
                  className={`border-b ${
                    i % 2 !== 0 ? "bg-[#f9eaea]" : "bg-white"
                  }`}
                >
                  <td className="p-3">{o.id}</td>
                  <td className="p-3">{o.customerName}</td>
                  <td className="p-3">{o.orderDate}</td>
                  <td className="p-3">₹{o.totalCost}</td>
                  <td className="p-3">
                    <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-700">
                      {o.orderStatus}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-3 flex gap-4 text-lg">
                    {/* 👁 VIEW */}
                    <button
                      title="View Order"
                      onClick={() => {
                        setSelectedOrder(o);
                        setShowView(true);
                      }}
                    >
                      👁️
                    </button>

                    {/* ✏️ EDIT */}
                    <button
                      title="Edit Order"
                      onClick={() => {
                        setSelectedOrder(o);
                        setShowEdit(true);
                      }}
                    >
                      ✏️
                    </button>

                    {/* 📄 INVOICE */}
                    <button
                      title="Download Invoice"
                      onClick={() => downloadInvoicePdf(o)}
                    >
                      📄
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* 👁 VIEW MODAL */}
      {showView && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h2 className="text-lg font-semibold text-[#7c1d1d] mb-4">
              Order Details
            </h2>

            <div className="space-y-2 text-sm">
              <p>
                <b>Order ID:</b> {selectedOrder.id}
              </p>
              <p>
                <b>Customer:</b> {selectedOrder.customerName}
              </p>
              <p>
                <b>Email:</b> {selectedOrder.customerEmail}
              </p>
              <p>
                <b>Phone:</b> {selectedOrder.customerPhone}
              </p>
              <p>
                <b>Date:</b> {selectedOrder.orderDate}
              </p>
              <p>
                <b>Amount:</b> ₹{selectedOrder.totalCost}
              </p>
              <p>
                <b>Status:</b> {selectedOrder.orderStatus}
              </p>
              <p>
                <b>Address:</b> {selectedOrder.address}
              </p>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowView(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✏️ EDIT MODAL */}
      {showEdit && selectedOrder && (
        <EditOrderModal
          order={selectedOrder}
          onClose={() => setShowEdit(false)}
          onSuccess={() => {
            setShowEdit(false);
            fetchOrders();
          }}
        />
      )}

      {/* ➕ ADD MODAL */}
      {showAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded w-full max-w-5xl">
            <AddOrderForm
              onCancel={() => {
                setShowAdd(false);
                fetchOrders();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
