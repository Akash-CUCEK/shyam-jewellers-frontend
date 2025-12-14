import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { API } from "../../utils/API";

export default function EditCategoryForm({ categoryId, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    status: "Active",
    updatedBy: sessionStorage.getItem("email") || "", // session se email
  });
  const [loading, setLoading] = useState(false);

  // Category details fetch
  const fetchCategory = async () => {
    try {
      const res = await API.fetch("/api/categories/getCategory", {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: categoryId }),
      });
      const data = await res.json();
      if (res.ok && data?.response) {
        setFormData({
          name: data.response.name || "",
          status: data.response.status ? "Active" : "Inactive",
          updatedBy: sessionStorage.getItem("email") || "",
        });
      } else {
        throw new Error(data?.message || "Failed to load category");
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

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.fetch("/api/categories/updateCategory", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: categoryId, // FIX: id send kar rahe hain
          ...formData,
          status: formData.status === "Active", // boolean convert
        }),
      });

      const data = await res.json();

      if (res.ok && data?.response) {
        Swal.fire("Success", "Category updated successfully", "success");
        onSuccess();
        onClose();
      } else {
        throw new Error(data?.message || "Failed to update category");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-red-600 transition text-2xl font-bold"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4 text-[#7c1d1d] border-b pb-2">
          Edit Category
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:outline-[#7c1d1d]"
            />
          </div>
          <div>
            <label className="block text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-[#7c1d1d]"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#7c1d1d] text-white px-4 py-2 rounded-md font-semibold hover:opacity-90"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
