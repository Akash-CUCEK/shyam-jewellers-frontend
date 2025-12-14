import React, { useState } from "react";
import Swal from "sweetalert2";
import { API } from "../../utils/API";

export default function AddRepairRequestForm({
  onClose,
  onSuccess = () => {},
}) {
  const [formData, setFormData] = useState({
    email: sessionStorage.getItem("userEmail") || "",
    name: "",
    address: "",
    mobileNumber: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post(
        "/api/common/createRepairRequest",
        finalProduct,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      const backendMsg =
        data?.message ||
        data?.response?.response ||
        "Repair request created successfully!";

      if (res.ok && data?.response) {
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
      console.error("Error creating repair request:", err);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Something went wrong",
        confirmButtonColor: "#7c1d1d",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-[#7c1d1d]">
          Add Repair Request
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              type="text"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Address</label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              type="text"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Mobile Number</label>
            <input
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              type="text"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            ></textarea>
          </div>

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
