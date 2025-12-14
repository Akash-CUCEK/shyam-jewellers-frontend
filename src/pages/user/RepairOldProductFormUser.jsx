import React, { useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export default function RepairOldProductFormUser({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    productType: "",
    issueDescription: "",
    preferredDate: "",
    comment: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Replace with your real backend URL
      const res = await axios.post(
        "http://localhost:8080/api/v1/repair-old-product/request",
        formData,
        { headers: { requestId: uuidv4() } }
      );
      toast.success(res.data?.response?.message || "Repair request submitted!");
      onClose();
    } catch (err) {
      const msg =
        err?.response?.data?.messages?.[0]?.message ||
        "Submission failed. Try again.";
      toast.error(msg);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
        >
          <X />
        </button>

        <h2 className="text-2xl font-bold text-center mb-4 text-[#800000]">
          Repair Old Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            required
            value={formData.address}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />

          <input
            type="text"
            name="productType"
            placeholder="Product Type (e.g. Ring, Necklace)"
            required
            value={formData.productType}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />

          <textarea
            name="issueDescription"
            placeholder="Describe the issue"
            required
            value={formData.issueDescription}
            onChange={handleChange}
            rows={3}
            className="w-full border px-4 py-2 rounded"
          />

          <input
            type="date"
            name="preferredDate"
            value={formData.preferredDate}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded"
          />

          <textarea
            name="comment"
            placeholder="Additional Comments (optional)"
            value={formData.comment}
            onChange={handleChange}
            rows={2}
            className="w-full border px-4 py-2 rounded"
          />

          <button
            type="submit"
            className="w-full bg-[#800000] text-white py-2 rounded hover:bg-[#a00000]"
          >
            Submit Repair Request
          </button>
        </form>
      </div>
    </div>
  );
}
