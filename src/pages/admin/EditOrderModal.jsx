import React, { useState } from "react";
import { API } from "../../utils/API";

export default function EditOrderModal({ order, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type, message }

  const [formData, setFormData] = useState({
    orderId: order.id, // ✅ FIXED (id → orderId)

    customerName: order.customerName || "",
    customerEmail: order.customerEmail || "",
    customerPhone: order.customerPhone || "",
    address: order.address || "",

    orderStatus: order.orderStatus || "PENDING",
    deliveryType: order.deliveryType || "Pickup",

    totalCost: order.totalCost ?? "",
    dueAmount: order.dueAmount ?? "",

    paymentMethod: order.paymentMethod || "CASH",
    notes: order.notes || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  /* ✅ SUBMIT UPDATE */
  const handleSubmit = async () => {
    // 🔴 BASIC VALIDATION
    if (!formData.orderStatus || formData.totalCost === "") {
      setToast({
        type: "error",
        message: "Please fill all required fields.",
      });
      return;
    }

    try {
      setLoading(true);
      setToast(null);

      const payload = {
        orderId: formData.orderId, // ✅ MUST MATCH BACKEND

        orderStatus: formData.orderStatus,
        deliveryType: formData.deliveryType,

        totalCost: Number(formData.totalCost),
        dueAmount: Number(formData.dueAmount || 0),

        paymentMethod: formData.paymentMethod,
        address: formData.address,
        notes: formData.notes,
      };

      const res = await API.post("/updateOrder", payload);

      // 🟢 SUCCESS MESSAGE FROM BACKEND
      setToast({
        type: "success",
        message: res?.data?.response?.message || "Order updated successfully",
      });

      setTimeout(() => {
        onSuccess();
      }, 800);
    } catch (err) {
      console.error("❌ Update order failed", err);
      setToast({
        type: "error",
        message:
          err?.response?.data?.errors?.messages?.[0]?.message ||
          "Failed to update order",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-xl rounded-xl flex flex-col max-h-[85vh]">
        {/* 🔔 TOAST */}
        {toast && (
          <div
            className={`px-4 py-3 flex justify-between items-center ${
              toast.type === "error"
                ? "bg-[#7c1d1d] text-gray-100"
                : "bg-green-700 text-white"
            }`}
          >
            <span className="text-sm font-medium">{toast.message}</span>
            <button onClick={() => setToast(null)}>✕</button>
          </div>
        )}

        {/* HEADER */}
        <div className="p-5 border-b">
          <h2 className="text-xl font-semibold text-[#7c1d1d]">Edit Order</h2>
        </div>

        {/* 🔽 SCROLLABLE BODY */}
        <div className="p-5 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* READ ONLY */}
            <div>
              <label className="text-sm font-semibold">Customer Name</label>
              <input
                disabled
                value={formData.customerName}
                className="w-full border bg-gray-100 p-2 rounded"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Customer Phone</label>
              <input
                disabled
                value={formData.customerPhone}
                className="w-full border bg-gray-100 p-2 rounded"
              />
            </div>

            {/* STATUS */}
            <div>
              <label className="text-sm font-semibold">Order Status *</label>
              <select
                name="orderStatus"
                value={formData.orderStatus}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option>CREATED</option>
                <option>CONFIRMED</option>
                <option>PENDING</option>
                <option>COMPLETED</option>
                <option>CANCELLED</option>
              </select>
            </div>

            {/* DELIVERY */}
            <div>
              <label className="text-sm font-semibold">Delivery Type</label>
              <select
                name="deliveryType"
                value={formData.deliveryType}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option>Pickup</option>
                <option>Home Delivery</option>
              </select>
            </div>

            {/* COST */}
            <div>
              <label className="text-sm font-semibold">Total Cost *</label>
              <input
                type="number"
                name="totalCost"
                value={formData.totalCost}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Due Amount</label>
              <input
                type="number"
                name="dueAmount"
                value={formData.dueAmount}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            {/* PAYMENT */}
            <div>
              <label className="text-sm font-semibold">Payment Method</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option>CASH</option>
                <option>UPI</option>
                <option>CARD</option>
                <option>NET_BANKING</option>
              </select>
            </div>

            {/* ADDRESS */}
            <div className="md:col-span-2">
              <label className="text-sm font-semibold">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                className="w-full border p-2 rounded"
              />
            </div>

            {/* NOTES */}
            <div className="md:col-span-2">
              <label className="text-sm font-semibold">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={2}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#7c1d1d] text-white px-4 py-2 rounded"
          >
            {loading ? "Updating..." : "Update Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
