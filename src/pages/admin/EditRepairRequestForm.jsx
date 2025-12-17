import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { API } from "../../utils/API";

export default function EditRepairRequestForm({ requestId, onClose, onSaved }) {
  const [formData, setFormData] = useState({
    serviceId: "",
    status: "",
    email: sessionStorage.getItem("userEmail") || "",
    name: "",
    address: "",
    mobileNumber: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  // 🔹 Fetch request by ID
  useEffect(() => {
    if (!requestId) return;

    const fetchData = async () => {
      try {
        const res = await API.post("/api/common/getRepairRequestById", {
          serviceId: requestId,
        });

        const data = res.data;

        if (data?.response) {
          setFormData({
            serviceId: data.response.serviceId || "",
            status: data.response.status || "",
            name: data.response.name || "",
            address: data.response.address || "",
            mobileNumber: data.response.mobileNumber || "",
            notes: data.response.notes || "",
            email: sessionStorage.getItem("userEmail") || "",
          });
        } else {
          Swal.fire("Error", "Failed to fetch request details.", "error");
        }
      } catch (err) {
        Swal.fire("Error", "Failed to fetch request details.", "error");
      }
    };

    fetchData();
  }, [requestId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.put("/api/common/editRepairRequest", formData);

      const data = res.data;

      if (data?.response) {
        Swal.fire("Success", "Repair request updated successfully!", "success");
        onSaved();
        onClose();
      } else {
        Swal.fire(
          "Error",
          data?.message || "Failed to update request",
          "error"
        );
      }
    } catch (err) {
      Swal.fire("Error", "Something went wrong while saving.", "error");
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = ["REQUESTED", "IN_PROCESS", "COMPLETED", "CANCELLED"];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4 text-[#7c1d1d]">
          Edit Repair Request
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" value={formData.serviceId} />

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Customer Name"
            required
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            required
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            placeholder="Mobile Number"
            required
            className="w-full p-2 border rounded"
          />

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
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
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
