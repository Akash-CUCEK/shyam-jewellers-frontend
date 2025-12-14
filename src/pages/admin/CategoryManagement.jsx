import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import AddCategoryForm from "./AddCategoryForm";
import EditCategoryForm from "./EditCategoryForm";
import { API } from "../../utils/API";

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewCategory, setViewCategory] = useState(null);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // ✅ Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await API.post("/api/categories/getAllCategory");
      const data = res.data;

      if (Array.isArray(data?.response?.getCategoriesResponseDTO)) {
        const mapped = data.response.getCategoriesResponseDTO.map((cat) => ({
          id: cat.categoryId,
          name: cat.name || "N/A",
          date: cat.createdAt
            ? new Date(cat.createdAt).toLocaleDateString()
            : "N/A",
          status: cat.status ? "Active" : "Inactive",
        }));
        setCategories(mapped);
      } else {
        Swal.fire("Failed", data?.message || "Invalid category list", "error");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ View category
  const handleViewClick = async (cat) => {
    try {
      const res = await API.post("/api/categories/getCategory", { id: cat.id });

      if (res.data?.success) {
        setViewCategory(res.data.response);
      } else {
        Swal.fire(
          "Failed",
          res.data?.message || "Could not fetch category",
          "error"
        );
      }
    } catch (err) {
      console.error("Failed to fetch category:", err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  // ✅ Delete category
  const handleDeleteClick = async (cat) => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: `Delete category ID: ${cat.id}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirmResult.isConfirmed) return;
    setDeletingId(cat.id);

    try {
      const res = await API.delete("/api/categories/deleteCategory", {
        data: { id: cat.id },
      });

      if (res.data?.success) {
        Swal.fire("Success", res.data.message || "Category deleted", "success");
        fetchCategories();
      } else {
        Swal.fire("Failed", res.data?.message || "Delete failed", "error");
      }
    } catch (err) {
      console.error("Delete error:", err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Something went wrong",
        "error"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      String(cat.id).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-[#f9f9f9] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-[#7c1d1d]">
          Category Management
        </h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-[#6e1414] text-white px-4 py-2 rounded-md font-semibold shadow hover:opacity-90"
        >
          Add Category
        </button>
      </div>

      {/* Search */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by category name or ID"
          className="w-full max-w-md p-2 border rounded-md focus:outline-[#7c1d1d]"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-left">
          <thead className="bg-[#f1f1f1] text-[#7c1d1d] font-medium">
            <tr>
              <th className="p-3">Category ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Added Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat, idx) => (
                <tr
                  key={cat.id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-[#f9eaea]"}
                >
                  <td className="p-3">{cat.id}</td>
                  <td className="p-3">{cat.name}</td>
                  <td className="p-3">{cat.date}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        cat.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {cat.status}
                    </span>
                  </td>
                  <td className="p-3 flex gap-3 text-[#7c1d1d]">
                    <FaEye
                      title="View"
                      className="text-gray-600 cursor-pointer"
                      onClick={() => handleViewClick(cat)}
                    />
                    <FaEdit
                      title="Edit"
                      className="text-blue-600 cursor-pointer"
                      onClick={() => setEditCategoryId(cat.id)}
                    />
                    <FaTrash
                      title="Delete"
                      className={`cursor-pointer ${
                        deletingId === cat.id
                          ? "text-gray-400 opacity-50 pointer-events-none"
                          : "text-red-600"
                      }`}
                      onClick={() =>
                        deletingId !== cat.id && handleDeleteClick(cat)
                      }
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-3 text-center" colSpan="6">
                  No matching categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-sm text-gray-600 mt-2 px-1">
        <span>Rows per page: 10 ⌄</span>
        <span>
          {filteredCategories.length > 0
            ? `1–${filteredCategories.length} of ${filteredCategories.length}`
            : "0 of 0"}
        </span>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <AddCategoryForm
          onClose={() => setShowAddForm(false)}
          onSuccess={fetchCategories}
        />
      )}

      {/* View Modal */}
      {viewCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-[90%] max-w-2xl p-6 relative animate-fadeIn">
            <button
              onClick={() => setViewCategory(null)}
              className="absolute top-3 right-4 text-gray-500 hover:text-red-600 transition text-2xl font-bold"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-5 text-center text-[#7c1d1d] border-b pb-2">
              Category Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(viewCategory).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-200"
                >
                  <p className="text-sm text-gray-500 font-semibold capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </p>
                  <p className="text-gray-800 font-medium">
                    {String(value) || "—"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit Form */}
      {editCategoryId && (
        <EditCategoryForm
          categoryId={editCategoryId}
          onClose={() => setEditCategoryId(null)}
          onSuccess={fetchCategories}
        />
      )}
    </div>
  );
}
