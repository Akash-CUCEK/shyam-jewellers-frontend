import React, { useState } from "react";
import { toast } from "react-hot-toast";

export default function HomeServiceFormUser({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    service: "",
    date: "",
    time: "",
    comment: "",
  });

  const services = [
    "Gold Cleaning at Home",
    "Repair Pickup",
    "Home Consultation",
    "Polishing at Doorstep",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Home service requested successfully!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl"
        >
          ×
        </button>

        <h2 className="text-2xl font-semibold text-center text-[#800000] mb-4">
          Request Home Service
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            type="text"
            required
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            name="phone"
            type="tel"
            required
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            name="address"
            type="text"
            required
            placeholder="Full Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <select
            name="service"
            required
            value={formData.service}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select a Service</option>
            {services.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input
            name="date"
            type="date"
            required
            value={formData.date}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            name="time"
            type="time"
            required
            value={formData.time}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <textarea
            name="comment"
            placeholder="Additional Comments (Optional)"
            rows="3"
            value={formData.comment}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />

          <button
            type="submit"
            className="w-full bg-[#800000] text-white py-2 rounded hover:bg-[#a00000]"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
}
