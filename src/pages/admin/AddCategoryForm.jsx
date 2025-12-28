import React, { useState } from "react";
import Swal from "sweetalert2";
import XLSX from "xlsx-js-style";
import { API } from "../../utils/API";
import { ImageUploader } from "../../utils/ImageUploader";

export default function AddCategoryForm({ onClose, onSuccess }) {
  const [uploadType, setUploadType] = useState("single");
  const [excelFile, setExcelFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const userEmail = sessionStorage.getItem("userEmail") || "SYSTEM";

  const [formData, setFormData] = useState({
    name: "",
    status: "Active",
    showOnHome: false,
    imageFile: null,
  });

  /* 🔁 HANDLE CHANGE */
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (!file) return;

      setFormData((prev) => ({ ...prev, imageFile: file }));
      setPreviewImage(URL.createObjectURL(file));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleExcelChange = (e) => {
    setExcelFile(e.target.files[0]);
  };

  /* 📥 SAMPLE EXCEL */
  const downloadSampleExcel = () => {
    const data = [
      [
        { v: "name", s: { font: { bold: true } } },
        { v: "status", s: { font: { bold: true } } },
      ],
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sample");
    XLSX.writeFile(wb, "CategorySample.xlsx");
  };

  /* ✅ SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (uploadType === "single") {
        if (!formData.name || !formData.imageFile) {
          Swal.fire("Error", "Category name & image required", "error");
          setLoading(false);
          return;
        }

        // 🔼 Upload image
        const imageUrls = await ImageUploader([formData.imageFile]);
        if (!imageUrls.length) throw new Error("Image upload failed");

        await API.post("/auth/api/v1/admin/addCategory", {
          name: formData.name,
          status: formData.status === "Active",
          createdBy: userEmail,
          imageUrl: imageUrls[0],
          showOnHome: formData.showOnHome,
        });

        Swal.fire("Success", "Category added successfully", "success");
      } else {
        // 📤 EXCEL UPLOAD
        const fd = new FormData();
        fd.append("file", excelFile);
        fd.append("createdBy", userEmail);

        await API.post("/api/categories/uploadExcel", fd, {
          responseType: "blob",
        });

        Swal.fire("Success", "Categories uploaded successfully", "success");
      }

      onSuccess();
      onClose();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Operation failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    /* 🌑 BACKDROP */
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3">
      {/* 📦 MODAL */}
      <div className="bg-white w-full max-w-lg rounded-xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto relative">
        {/* ❌ Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl text-gray-500 hover:text-red-600"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4 text-[#7c1d1d]">Add Category</h2>

        {/* 🔀 Toggle */}
        <div className="flex mb-4 rounded overflow-hidden border">
          <button
            type="button"
            onClick={() => setUploadType("single")}
            className={`flex-1 py-2 font-medium ${
              uploadType === "single"
                ? "bg-[#7c1d1d] text-white"
                : "bg-gray-100"
            }`}
          >
            Single
          </button>
          <button
            type="button"
            onClick={() => setUploadType("excel")}
            className={`flex-1 py-2 font-medium ${
              uploadType === "excel" ? "bg-[#7c1d1d] text-white" : "bg-gray-100"
            }`}
          >
            Excel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {uploadType === "single" ? (
            <>
              <input
                name="name"
                placeholder="Category name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-3 border rounded-md"
              />

              {/* 📸 IMAGE */}
              <div>
                <label className="text-sm font-semibold">
                  Category Image *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="preview"
                    className="h-28 mt-2 rounded border object-cover"
                  />
                )}
              </div>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-3 border rounded-md"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>

              {/* 🏠 SHOW ON HOME */}
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="showOnHome"
                  checked={formData.showOnHome}
                  onChange={handleChange}
                />
                Show on Home Page
              </label>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={downloadSampleExcel}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Download Sample
              </button>

              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleExcelChange}
                required
                className="w-full px-3 py-3 border rounded-md"
              />
            </>
          )}

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>

            <button
              disabled={loading || (uploadType === "excel" && !excelFile)}
              className="bg-[#7c1d1d] text-white px-5 py-2 rounded disabled:opacity-50"
            >
              {loading ? "Processing..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
