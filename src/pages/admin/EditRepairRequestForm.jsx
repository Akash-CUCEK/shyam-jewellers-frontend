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

  useEffect(() => {
    if (!requestId) return;

    const fetchData = async () => {
      try {
        const res = await API.post("/api/common/getRepairRequestById", {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ serviceId: requestId }),
        });

        const data = await res.json();

        if (data?.response) {
          setFormData((prev) => ({
            ...prev,
            serviceId: data.response.serviceId || "",
            status: data.response.status || "",
            name: data.response.name || "",
            address: data.response.address || "",
            mobileNumber: data.response.mobileNumber || "",
            notes: data.response.notes || "",
          }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.put("/api/common/editRepairRequest", {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

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
          <input type="hidden" name="serviceId" value={formData.serviceId} />

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
            type="text"
            name="mobileNumber"
            placeholder="Mobile Number"
            value={formData.mobileNumber}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <textarea
            name="notes"
            placeholder="Notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          ></textarea>

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
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
