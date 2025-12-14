import React, { useState } from "react";
import Swal from "sweetalert2";
import { API } from "../../utils/API";

export default function AddHomeServiceForm({ onClose, onSuccess = () => {} }) {
  const [formData, setFormData] = useState({
    name: "",
    email: sessionStorage.getItem("userEmail") || "",
    address: "",
    phoneNumber: "",
    serviceType: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  // Static service type list (enum values + Others)
  const serviceTypes = [
    "REPAIR",
    "NEW_PURCHASE",
    "SALE_PRODUCT",
    "LOAN",
    "OTHERS",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post(
        "/api/homeService/createHomeServiceRequest",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      const data = res.data;
      const backendMsg =
        data?.message ||
        data?.response?.response ||
        "Home service request created successfully!";

      if (res.status === 200 && data?.response) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: backendMsg,
          confirmButtonColor: "#7c1d1d",
        });
        onSuccess();
        onClose();
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text: backendMsg,
          confirmButtonColor: "#7c1d1d",
        });
      }
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        "Something went wrong, please try again!";
      console.error("Error creating home service request:", err);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: errMsg,
        confirmButtonColor: "#7c1d1d",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4 text-[#7c1d1d]">
          Add Home Service Request
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Customer Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <select
            name="serviceType"
            value={formData.serviceType}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Service Type</option>
            {serviceTypes.map((type, idx) => (
              <option key={idx} value={type}>
                {type}
              </option>
            ))}
          </select>

          <textarea
            name="notes"
            placeholder="Notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          ></textarea>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={`px-4 py-2 rounded ${
                loading
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gray-300"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded text-white ${
                loading
                  ? "bg-[#7c1d1d80] cursor-not-allowed"
                  : "bg-[#7c1d1d] hover:opacity-90"
              }`}
            >
              {loading ? "Saving..." : "Save Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
