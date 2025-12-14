import React, { useState } from "react";
import { toast } from "react-hot-toast";

export default function AppointmentFormUser({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    service: "",
    date: "",
    time: "",
    comment: "",
  });

  const services = [
    "Try Ornaments",
    "Bridal Consultation",
    "Custom Design Discussion",
    "Jewelry Cleaning",
    "Jewelry Repairing",
    "Gold Loan Inquiry",
  ];

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Appointment requested successfully!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl text-gray-600 hover:text-black"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-center text-[#7c1d1d] mb-4">
          Book New Appointment
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            required
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
            type="date"
            name="date"
            required
            value={formData.date}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="time"
            name="time"
            required
            value={formData.time}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <textarea
            name="comment"
            placeholder="Additional Comments"
            rows={3}
            value={formData.comment}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          ></textarea>
          <button
            type="submit"
            className="w-full bg-[#7c1d1d] text-white py-2 rounded hover:bg-[#5c1212]"
          >
            Submit Appointment
          </button>
        </form>
      </div>
    </div>
  );
}
