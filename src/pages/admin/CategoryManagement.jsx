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

      if (res.data?.response?.getCategoriesResponseDTO && !res.data?.errors) {
        const mapped = res.data.response.getCategoriesResponseDTO.map(
          (cat) => ({
            id: cat.categoryId,
            name: cat.name || "N/A",
            date: cat.createdAt
              ? new Date(cat.createdAt).toLocaleDateString()
              : "N/A",
            status: cat.status ? "Active" : "Inactive",
          })
        );

        setCategories(mapped);
      } else {
        Swal.fire(
          "Failed",
          res.data?.errors?.messages?.[0]?.message || "Invalid category list",
          "error"
        );
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.errors?.messages?.[0]?.message ||
          "Something went wrong",
        "error"
      );
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ View category (FIXED)
  const handleViewClick = async (cat) => {
    try {
      const res = await API.post("/api/categories/getCategory", {
        id: cat.id,
      });

      if (res.data?.response && !res.data?.errors) {
        setViewCategory(res.data.response);
      } else {
        Swal.fire(
          "Failed",
          res.data?.errors?.messages?.[0]?.message ||
            "Could not fetch category",
          "error"
        );
      }
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.errors?.messages?.[0]?.message ||
          "Something went wrong",
        "error"
      );
    }
  };

  // ✅ Delete category (FIXED)
  const handleDeleteClick = async (cat) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `Delete category ID ${cat.id}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    });

    if (!confirm.isConfirmed) return;
    setDeletingId(cat.id);

    try {
      const res = await API.delete("/api/categories/deleteCategory", {
        data: { id: cat.id },
      });

      if (res.data?.response && !res.data?.errors) {
        Swal.fire("Success", "Category deleted successfully", "success");
        fetchCategories();
      } else {
        Swal.fire(
          "Failed",
          res.data?.errors?.messages?.[0]?.message || "Delete failed",
          "error"
        );
      }
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.errors?.messages?.[0]?.message ||
          "Something went wrong",
        "error"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      String(cat.id).includes(search)
  );

  return (
    <div className="p-6 bg-[#f9f9f9] min-h-screen">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold text-[#7c1d1d]">
          Category Management
        </h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-[#6e1414] text-white px-4 py-2 rounded"
        >
          Add Category
        </button>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search"
        className="mb-4 p-2 border rounded w-full max-w-md"
      />

      <table className="w-full bg-white rounded shadow">
        <thead className="bg-[#f1f1f1]">
          <tr>
            <th className="p-3">ID</th>
            <th>Name</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.map((cat, i) => (
            <tr key={cat.id} className={i % 2 ? "bg-[#f9eaea]" : ""}>
              <td className="p-3">{cat.id}</td>
              <td>{cat.name}</td>
              <td>{cat.date}</td>
              <td>{cat.status}</td>
              <td className="flex gap-3 p-3">
                <FaEye onClick={() => handleViewClick(cat)} />
                <FaEdit onClick={() => setEditCategoryId(cat.id)} />
                <FaTrash
                  onClick={() => handleDeleteClick(cat)}
                  className="text-red-600"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showAddForm && (
        <AddCategoryForm
          onClose={() => setShowAddForm(false)}
          onSuccess={fetchCategories}
        />
      )}

      {editCategoryId && (
        <EditCategoryForm
          categoryId={editCategoryId}
          onClose={() => setEditCategoryId(null)}
          onSuccess={fetchCategories}
        />
      )}

      {viewCategory && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-[500px]">
            <button
              onClick={() => setViewCategory(null)}
              className="float-right"
            >
              ✕
            </button>
            <h2 className="text-xl mb-4">Category Details</h2>
            {Object.entries(viewCategory).map(([k, v]) => (
              <p key={k}>
                <b>{k}</b>: {String(v)}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
