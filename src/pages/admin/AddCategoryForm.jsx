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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleExcelChange = (e) => {
    setExcelFile(e.target.files[0]);
  };

  const downloadSampleExcel = () => {
    const sampleData = [
      [
        { v: "name", s: { font: { bold: true, sz: 14 } } },
        { v: "status", s: { font: { bold: true, sz: 14 } } },
      ],
    ];
    const ws = XLSX.utils.aoa_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sample");
    XLSX.writeFile(wb, "CategorySample.xlsx");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let res;
      if (uploadType === "single") {
        res = await API.post("/api/categories/addCategory", {
          name: formData.name,
          createdBy: userEmail,
          status: formData.status === "Active",
        });
      } else {
        const formDataExcel = new FormData();
        formDataExcel.append("file", excelFile);
        formDataExcel.append("createdBy", userEmail);

        res = await API.post("/api/categories/uploadExcel", formDataExcel);
      }

      Swal.fire({
        icon: "success",
        title: "Success",
        text: res.data.message || "Operation successful",
        confirmButtonColor: "#7c1d1d", // ✅ theme color
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Add category error:", err);

      let errMsg =
        err.response?.data?.message || // agar message key hai toh wahi
        err.response?.data?.messages?.[0] || // agar array of messages hai toh first
        err.response?.data?.error || // agar error string hai
        err.message || // default JS error
        "Operation failed"; // fallback

      // ✅ Agar galti se object aagya toh uska readable string nikal lo
      if (typeof errMsg === "object") {
        errMsg = errMsg.message || JSON.stringify(errMsg);
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errMsg,
        confirmButtonColor: "#7c1d1d", // ✅ theme color
      });
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
          Add Category
        </h2>

        <div className="flex mb-4">
          <button
            className={`flex-1 p-2 border ${
              uploadType === "single"
                ? "bg-[#7c1d1d] text-white"
                : "bg-gray-100"
            }`}
            onClick={() => setUploadType("single")}
            type="button"
          >
            Single Upload
          </button>
          <button
            className={`flex-1 p-2 border ${
              uploadType === "excel" ? "bg-[#7c1d1d] text-white" : "bg-gray-100"
            }`}
            onClick={() => setUploadType("excel")}
            type="button"
          >
            Excel Upload
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {uploadType === "single" ? (
            <>
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
            </>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-700">Upload Excel</label>
                <button
                  type="button"
                  onClick={downloadSampleExcel}
                  className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:opacity-90"
                >
                  Download Sample
                </button>
              </div>
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleExcelChange}
                required
                className="w-full p-2 border rounded-md"
              />
              <p className="text-sm text-gray-500 mt-1">
                Excel should contain: <b>name, status</b>
              </p>
            </div>
          )}

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
              {loading ? "Processing..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
