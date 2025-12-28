import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { API } from "../../utils/API";
import { ImageUploader } from "../../utils/ImageUploader";

export default function EditCategoryForm({ categoryId, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    status: "Active",
    showOnHome: false,
    imageUrl: "",
    updatedBy: sessionStorage.getItem("userEmail") || "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  /* ================= FETCH CATEGORY ================= */
  useEffect(() => {
    if (!categoryId) return;

    const fetchCategory = async () => {
      try {
        const res = await API.post("/auth/api/v1/admin/getCategory", {
          id: categoryId,
        });

        if (res.data?.response && !res.data?.errors) {
          const data = res.data.response;

          setFormData({
            name: data.name || "",
            status: data.status ? "Active" : "Inactive",
            showOnHome: Boolean(data.showOnHome),
            imageUrl: data.imageUrl || "",
            updatedBy: sessionStorage.getItem("userEmail") || "",
          });

          setImagePreview(data.imageUrl || "");
        }
      } catch {
        Swal.fire("Error", "Unable to load category", "error");
      }
    };

    fetchCategory();
  }, [categoryId]);

  /* ================= CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "showOnHome" ? value === "true" : value,
    }));
  };

  /* ================= IMAGE CHANGE ================= */
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  /* ================= UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      Swal.fire("Validation", "Category name is required", "warning");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = formData.imageUrl;

      // upload new image only if selected
      if (imageFile) {
        const uploaded = await ImageUploader([imageFile]);
        if (!uploaded.length) {
          throw new Error("Image upload failed");
        }
        imageUrl = uploaded[0];
      }

      await API.put("/auth/api/v1/admin/updateCategory", {
        id: categoryId,
        name: formData.name,
        status: formData.status === "Active",
        showOnHome: formData.showOnHome,
        imageUrl,
        updatedBy: formData.updatedBy,
      });

      Swal.fire("Success", "Category updated successfully", "success");

      onSuccess();
      onClose();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.errors?.messages?.[0]?.message ||
          err.message ||
          "Update failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg relative">
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4 text-[#7c1d1d] border-b pb-2">
          Edit Category
        </h2>

        {/* IMAGE PREVIEW */}
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Category"
            className="w-full h-44 object-cover rounded-md border mb-4"
          />
        )}

        {/* IMAGE UPLOAD */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">
            Change Photo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NAME */}
          <div>
            <label className="block text-sm font-semibold mb-1">Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* STATUS */}
          <div>
            <label className="block text-sm font-semibold mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* SHOW ON HOME */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Show On Home
            </label>
            <select
              name="showOnHome"
              value={String(formData.showOnHome)}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              className="bg-[#7c1d1d] text-white px-4 py-2 rounded disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
