import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { API } from "../../utils/API";

export default function EditCategoryForm({ categoryId, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    status: "Active",
    updatedBy: sessionStorage.getItem("userEmail") || "",
  });
  const [loading, setLoading] = useState(false);

  // ✅ Fetch category details
  const fetchCategory = async () => {
    try {
      const res = await API.post("/api/categories/getCategory", {
        id: categoryId,
      });

      if (res.data?.response) {
        setFormData({
          name: res.data.response.name || "",
          status: res.data.response.status ? "Active" : "Inactive",
          updatedBy: sessionStorage.getItem("userEmail") || "",
        });
      } else {
        throw new Error("Failed to load category");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message, "error");
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [categoryId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Update category
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.put("/api/categories/updateCategory", {
        id: categoryId,
        name: formData.name,
        status: formData.status === "Active",
        updatedBy: formData.updatedBy,
      });

      Swal.fire("Success", "Category updated successfully", "success");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Update failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4 text-[#7c1d1d] border-b pb-2">
          Edit Category
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="border px-4 py-2"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              className="bg-[#7c1d1d] text-white px-4 py-2 rounded"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
