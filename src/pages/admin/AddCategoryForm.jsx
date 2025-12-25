import React, { useState } from "react";
import Swal from "sweetalert2";
import XLSX from "xlsx-js-style";
import { API } from "../../utils/API";

export default function AddCategoryForm({ onClose, onSuccess }) {
  const [uploadType, setUploadType] = useState("single");
  const [formData, setFormData] = useState({ name: "", status: "Active" });
  const [excelFile, setExcelFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const userEmail = sessionStorage.getItem("userEmail") || "";

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleExcelChange = (e) => setExcelFile(e.target.files[0]);

  // ✅ Download sample Excel
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Single upload
      if (uploadType === "single") {
        await API.post("/api/categories/addCategory", {
          name: formData.name,
          status: formData.status === "Active",
          createdBy: userEmail,
        });

        Swal.fire("Success", "Category added successfully", "success");
      }

      // ✅ Excel upload
      else {
        const fd = new FormData();
        fd.append("file", excelFile);
        fd.append("createdBy", userEmail);

        await API.post("/api/categories/uploadExcel", fd, {
          responseType: "blob", // ⭐ KEY FIX
        });

        Swal.fire("Success", "Categories uploaded successfully", "success");
      }

      onSuccess();
      onClose();
    } catch (err) {
      // ✅ Excel validation error (400 + blob)
      if (
        uploadType === "excel" &&
        err.response?.status === 400 &&
        err.response.data instanceof Blob
      ) {
        const blob = new Blob([err.response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "Category_Error_Report.xlsx";
        document.body.appendChild(link);
        link.click();
        link.remove();

        Swal.fire(
          "Validation Error",
          "Excel has validation errors. Error file downloaded.",
          "error"
        );
        return;
      }

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl font-bold"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4 text-[#7c1d1d]">Add Category</h2>

        <div className="flex mb-4">
          <button
            className={`flex-1 p-2 ${
              uploadType === "single" && "bg-[#7c1d1d] text-white"
            }`}
            onClick={() => setUploadType("single")}
            type="button"
          >
            Single
          </button>
          <button
            className={`flex-1 p-2 ${
              uploadType === "excel" && "bg-[#7c1d1d] text-white"
            }`}
            onClick={() => setUploadType("excel")}
            type="button"
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
                className="w-full p-2 border rounded"
              />

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={downloadSampleExcel}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Download Sample
              </button>

              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleExcelChange}
                required
                className="w-full p-2 border rounded"
              />
            </>
          )}

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button
              disabled={loading || (uploadType === "excel" && !excelFile)}
              className="bg-[#7c1d1d] text-white px-4 py-2 rounded"
            >
              {loading ? "Processing..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
