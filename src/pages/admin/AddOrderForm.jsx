import React, { useState } from "react";
import { API } from "../../utils/API";

export default function AddOrderForm({ onCancel }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    address: "",
    products: "",
    orderStatus: "Pending",
    deliveryType: "Pickup",
    totalCost: "",
    dueAmount: "",
    paymentMethod: "Cash",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ✅ SUBMIT ORDER */
  const handleSubmit = async () => {
    if (
      !formData.customerName ||
      !formData.customerEmail ||
      !formData.customerPhone ||
      !formData.totalCost
    ) {
      setError("Please fill all required fields before submitting the order.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        address: formData.address,

        products: formData.products
          ? formData.products.split(",").map((id) => Number(id.trim()))
          : [],

        orderStatus: formData.orderStatus,
        deliveryType: formData.deliveryType,

        totalCost: Number(formData.totalCost),
        dueAmount: Number(formData.dueAmount || 0),

        paymentMethod: formData.paymentMethod,
        notes: formData.notes,

        // 🔐 AUTO FROM LOGIN
        createdBy: sessionStorage.getItem("email"),
        createdByRole: sessionStorage.getItem("role"),
      };

      await API.post("/createOrder", payload);
      onCancel();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-h-[80vh]">
      {/* LEFT FORM (SCROLLABLE) */}
      <div className="flex-1 bg-white rounded-xl shadow-md flex flex-col">
        {/* 🔴 ERROR TOAST */}
        {error && (
          <div className="bg-[#7C1D1D] text-gray-100 px-4 py-3 flex justify-between items-center rounded-t-xl">
            <span className="text-sm font-medium">{error}</span>
            <button
              onClick={() => setError("")}
              className="text-xl font-bold hover:opacity-80"
            >
              ✕
            </button>
          </div>
        )}

        <div className="p-6 overflow-y-auto">
          <h2 className="text-2xl font-semibold text-[#7C1D1D] mb-6">
            Add Order
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { label: "Customer Name*", name: "customerName" },
              { label: "Customer Email*", name: "customerEmail" },
              { label: "Customer Phone*", name: "customerPhone" },
              { label: "Delivery Address", name: "address" },
              { label: "Product IDs (comma separated)", name: "products" },
            ].map((f, i) => (
              <div key={i}>
                <label className="text-sm font-semibold mb-1 block">
                  {f.label}
                </label>
                <input
                  name={f.name}
                  value={formData[f.name]}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            ))}

            <div>
              <label className="text-sm font-semibold mb-1 block">
                Delivery Type
              </label>
              <select
                name="deliveryType"
                value={formData.deliveryType}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option>Pickup</option>
                <option>Home Delivery</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold mb-1 block">
                Payment Method
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option>Cash</option>
                <option>UPI</option>
                <option>Card</option>
                <option>Wallet</option>
                <option>NEFT</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold mb-1 block">
                Total Cost*
              </label>
              <input
                type="number"
                name="totalCost"
                value={formData.totalCost}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-1 block">
                Due Amount
              </label>
              <input
                type="number"
                name="dueAmount"
                value={formData.dueAmount}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold mb-1 block">
                Notes / Remarks
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SUMMARY */}
      <div className="w-full lg:w-72 bg-[#fce8e8] p-5 rounded-xl shadow-md h-fit">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

        <p>
          <b>Total:</b> ₹{formData.totalCost || 0}
        </p>
        <p>
          <b>Due:</b> ₹{formData.dueAmount || 0}
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#7C1D1D] text-white py-2 rounded-xl font-semibold"
          >
            {loading ? "Submitting..." : "Submit Order"}
          </button>

          <button
            onClick={onCancel}
            className="border border-[#7c1d1d] text-[#7c1d1d] py-2 rounded-xl font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
