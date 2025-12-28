import React, { useState, useEffect, useRef } from "react";
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
  const [loading, setLoading] = useState(false);

  const fetchedOnce = useRef(false);

  /* ================= FETCH ================= */
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await API.post("/auth/api/v1/admin/getAllCategory");
      if (res.data?.response?.getCategoriesResponseDTO) {
        setCategories(
          res.data.response.getCategoriesResponseDTO.map((cat) => ({
            id: cat.categoryId,
            name: cat.name,
            date: cat.createdAt
              ? new Date(cat.createdAt).toLocaleDateString()
              : "N/A",
            status: cat.status ? "Active" : "Inactive",
            showOnHome: cat.showOnHome,
          }))
        );
      }
    } catch {
      Swal.fire("Error", "Failed to load categories", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!fetchedOnce.current) {
      fetchedOnce.current = true;
      fetchCategories();
    }
  }, []);

  /* ================= VIEW ================= */
  const handleViewClick = async (cat) => {
    try {
      const res = await API.post("/auth/api/v1/admin/getCategory", {
        id: cat.id,
      });
      if (res.data?.response && !res.data?.errors) {
        setViewCategory(res.data.response);
      }
    } catch {
      Swal.fire("Error", "Unable to fetch category details", "error");
    }
  };

  /* ================= DELETE ================= */
  const handleDeleteClick = async (cat) => {
    const confirm = await Swal.fire({
      title: "Delete Category?",
      text: `Category ID ${cat.id}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7c1d1d",
    });

    if (!confirm.isConfirmed) return;

    try {
      await API.delete("/auth/api/v1/admin/deleteCategory", {
        data: { id: cat.id },
      });
      Swal.fire("Deleted", "Category removed", "success");
      fetchCategories();
    } catch {
      Swal.fire("Error", "Delete failed", "error");
    }
  };

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      String(cat.id).includes(search)
  );

  return (
    <div className="p-4 sm:p-6 bg-[#f9f9f9] min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-[#7c1d1d]">
          Category Management
        </h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-[#7c1d1d] text-white px-5 py-2 rounded-lg shadow"
        >
          Add Category
        </button>
      </div>

      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or ID..."
        className="mb-5 px-3 py-2 border rounded-lg 
           w-full sm:w-72 md:w-64"
      />

      {/* ================= DESKTOP TABLE ================= */}
      {!loading && filteredCategories.length > 0 && (
        <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f1f1f1] text-sm">
              <tr>
                <th className="p-4 text-[#7c1d1d]">ID</th>
                <th className="p-4 text-[#7c1d1d]">Name</th>
                <th className="p-4 text-[#7c1d1d]">Date</th>
                <th className="p-4 text-[#7c1d1d]">Show On Home</th>
                <th className="p-4 text-[#7c1d1d]">Status</th>
                <th className="p-4 text-[#7c1d1d]">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCategories.map((cat, i) => (
                <tr
                  key={cat.id}
                  className={`border-t ${
                    i % 2 === 0 ? "bg-white" : "bg-[#faf0f0]"
                  }`}
                >
                  <td className="p-4">{cat.id}</td>
                  <td className="p-4 font-medium">{cat.name}</td>
                  <td className="p-4">{cat.date}</td>
                  <td className="p-4 text-center">
                    {cat.showOnHome ? "Yes" : "No"}
                  </td>
                  <td className="p-4 text-center">{cat.status}</td>
                  <td className="p-4">
                    <div className="flex gap-4 text-lg">
                      <FaEye onClick={() => handleViewClick(cat)} />
                      <FaEdit onClick={() => setEditCategoryId(cat.id)} />
                      <FaTrash
                        className="text-red-600"
                        onClick={() => handleDeleteClick(cat)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= MOBILE VIEW ================= */}
      {!loading && filteredCategories.length > 0 && (
        <div className="block md:hidden space-y-4">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-xl shadow p-4 space-y-3"
            >
              {/* NAME + STATUS (TOP ROW) */}
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-[#7c1d1d] text-lg">
                  {cat.name}
                </h3>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    cat.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {cat.status}
                </span>
              </div>

              {/* DETAILS */}
              <p className="text-sm text-gray-700">
                <b>ID:</b> {cat.id}
              </p>

              <p className="text-sm text-gray-700">
                <b>Date:</b> {cat.date}
              </p>

              <p className="text-sm text-gray-700">
                <b>Show On Home:</b>{" "}
                <span
                  className={`font-semibold ${
                    cat.showOnHome ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {cat.showOnHome ? "Yes" : "No"}
                </span>
              </p>

              {/* ACTIONS */}
              <div className="flex gap-6 pt-2 text-lg text-gray-600">
                <FaEye
                  className="cursor-pointer"
                  onClick={() => handleViewClick(cat)}
                />
                <FaEdit
                  className="cursor-pointer"
                  onClick={() => setEditCategoryId(cat.id)}
                />
                <FaTrash
                  className="cursor-pointer text-red-600"
                  onClick={() => handleDeleteClick(cat)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= VIEW MODAL ================= */}
      {viewCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3">
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative shadow-xl">
            <button
              onClick={() => setViewCategory(null)}
              className="absolute top-3 right-4 text-xl font-bold"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-4 text-[#7c1d1d]">
              Category Details
            </h2>

            {viewCategory.imageUrl && (
              <img
                src={viewCategory.imageUrl}
                alt={viewCategory.name}
                className="w-full h-44 object-cover rounded-lg border mb-4"
              />
            )}

            <div className="space-y-2 text-sm">
              <p>
                <b>ID:</b> {viewCategory.categoryId}
              </p>
              <p>
                <b>Name:</b> {viewCategory.name}
              </p>
              <p>
                <b>Show On Home:</b> {viewCategory.showOnHome ? "Yes" : "No"}
              </p>
              <p>
                <b>Status:</b> {viewCategory.status ? "Active" : "Inactive"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ADD */}
      {showAddForm && (
        <AddCategoryForm
          onClose={() => setShowAddForm(false)}
          onSuccess={fetchCategories}
        />
      )}

      {/* EDIT */}
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
