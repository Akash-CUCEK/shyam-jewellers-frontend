import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { API } from "../../utils/API";

export default function EditHomeServiceForm({ requestId, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    serviceId: "",
    name: "",
    email: sessionStorage.getItem("userEmail") || "",
    address: "",
    phoneNumber: "",
    serviceType: "",
    notes: "",
    status: "",
  });

  const [loading, setLoading] = useState(false);

  const serviceTypes = [
    "REPAIR",
    "NEW_PURCHASE",
    "SALE_PRODUCT",
    "LOAN",
    "OTHERS",
  ];

  // 🔹 FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.post(
          "/api/homeService/getHomeServiceRequestById",
          { serviceId: requestId }
        );

        const data = res.data;

        if (data?.response) {
          setFormData({
            serviceId: data.response.serviceId,
            name: data.response.name || "",
            email:
              data.response.email || sessionStorage.getItem("userEmail") || "",
            address: data.response.address || "",
            phoneNumber: data.response.phoneNumber || "",
            serviceType: data.response.serviceType || "",
            notes: data.response.notes || "",
            status: data.response.status || "",
          });
        }
      } catch (err) {
        Swal.fire("Error", "Failed to fetch request details", "error");
      }
    };

    if (requestId) fetchData();
  }, [requestId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 SUBMIT DATA
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.put(
        "/api/homeService/editHomeServiceRequest",
        formData
      );

      const data = res.data;

      if (data?.response) {
        Swal.fire(
          "Success",
          "Home Service Request updated successfully!",
          "success"
        );
        onSuccess();
        onClose();
      } else {
        Swal.fire(
          "Error",
          data?.message || "Failed to update request",
          "error"
        );
      }
    } catch (err) {
      Swal.fire("Error", "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4 text-[#7c1d1d]">
          Edit Home Service Request
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Customer Name"
            required
            className="w-full p-2 border rounded"
          />

          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            required
            className="w-full p-2 border rounded"
          />

          <input
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
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
            {serviceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Notes"
            className="w-full p-2 border rounded"
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Status</option>
            <option value="REQUESTED">REQUESTED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#7c1d1d] text-white rounded"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
