import React, { useState } from "react";

export default function AddOrderForm({ onCancel }) {
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    address: "",
    products: "",
    orderDateTime: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16),
    orderStatus: "Pending",
    deliveryType: "Pickup",
    totalCost: "",
    dueAmount: "",
    paymentStatus: "Unpaid",
    paymentMethod: "Cash",
    notes: "",
    createdBy: "Admin",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left Section - Form */}
      <div className="flex-1 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-[#7C1D1D] mb-6">
          Add Order
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Text Inputs */}
          {[
            { label: "Customer Name*", name: "customerName", type: "text" },
            {
              label: "Customer Email ID*",
              name: "customerEmail",
              type: "email",
            },
            {
              label: "Customer Phone Number*",
              name: "customerPhone",
              type: "tel",
            },
            { label: "Delivery Address", name: "address", type: "text" },
            { label: "Product / Services", name: "products", type: "text" },
            {
              label: "Order Date & Time",
              name: "orderDateTime",
              type: "datetime-local",
            },
          ].map((field, i) => (
            <div key={i}>
              <label className="text-sm text-gray-800 font-semibold mb-1 block">
                {field.label}
              </label>
              <input
                name={field.name}
                type={field.type}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C1D1D]"
                value={formData[field.name]}
                onChange={handleChange}
              />
            </div>
          ))}

          {/* Select Inputs */}
          <div>
            <label className="text-sm text-gray-800 font-semibold mb-1 block">
              Order Status
            </label>
            <select
              name="orderStatus"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C1D1D]"
              value={formData.orderStatus}
              onChange={handleChange}
            >
              <option>Pending</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-800 font-semibold mb-1 block">
              Delivery Type
            </label>
            <select
              name="deliveryType"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C1D1D]"
              value={formData.deliveryType}
              onChange={handleChange}
            >
              <option>Pickup</option>
              <option>Home Delivery</option>
            </select>
          </div>

          {/* Cost and Due */}
          <div>
            <label className="text-sm text-gray-800 font-semibold mb-1 block">
              Total Cost
            </label>
            <input
              name="totalCost"
              type="number"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C1D1D]"
              value={formData.totalCost}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm text-gray-800 font-semibold mb-1 block">
              Any Due Amount
            </label>
            <input
              name="dueAmount"
              type="number"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C1D1D]"
              value={formData.dueAmount}
              onChange={handleChange}
            />
          </div>

          {/* Payment Info */}
          <div>
            <label className="text-sm text-gray-800 font-semibold mb-1 block">
              Payment Status
            </label>
            <select
              name="paymentStatus"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C1D1D]"
              value={formData.paymentStatus}
              onChange={handleChange}
            >
              <option>Paid</option>
              <option>Unpaid</option>
              <option>Partially Paid</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-800 font-semibold mb-1 block">
              Payment Method
            </label>
            <select
              name="paymentMethod"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C1D1D]"
              value={formData.paymentMethod}
              onChange={handleChange}
            >
              <option>Cash</option>
              <option>UPI</option>
              <option>Card</option>
              <option>Wallet</option>
              <option>NEFT</option>
            </select>
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <label className="text-sm text-gray-800 font-semibold mb-1 block">
              Notes / Remarks
            </label>
            <textarea
              name="notes"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#7C1D1D]"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
            />
          </div>

          {/* Created By */}
          <div>
            <label className="text-sm text-gray-800 font-semibold mb-1 block">
              Created By
            </label>
            <input
              name="createdBy"
              type="text"
              readOnly
              className="w-full bg-gray-100 text-gray-500 border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={formData.createdBy}
            />
          </div>
        </div>
      </div>

      {/* Right Section - Order Summary */}
      <div className="w-full lg:w-72 bg-[#fce8e8] p-5 rounded-xl shadow-md h-fit">
        <h3 className="text-lg font-semibold text-[#0D1B2A] mb-4">
          Order Summary
        </h3>
        <p className="text-sm">
          <strong>Total:</strong> ₹{formData.totalCost || 0}
        </p>
        <p className="text-sm">
          <strong>Due:</strong> ₹{formData.dueAmount || 0}
        </p>
        <p className="text-sm mt-2 text-gray-600 italic">
          Summary preview will be displayed here.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <button className="bg-[#7C1D1D] text-white py-2 rounded-xl font-semibold hover:bg-[#5f1313] transition">
            Submit Order
          </button>
          <button
            onClick={onCancel}
            className="border border-[#7c1d1d] text-[#7c1d1d] py-2 rounded-xl font-semibold transition duration-200 hover:bg-[#faeaea] hover:text-[#5f1313]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
