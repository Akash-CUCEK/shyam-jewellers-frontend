import React, { useState, useEffect } from "react";
import AddProductForm from "./AddProductForm";
import { Pencil, Trash2, FileText, Filter, List, User } from "lucide-react";
import { API } from "../../utils/API";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import Swal from "sweetalert2";
import EditProductForm from "./EditProductForm";
import ViewProductModal from "./ViewProductModal";
import FilterProduct from "./FilterProduct";

export default function ProductManagement() {
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // ✅ Fetch products
  const fetchProducts = async () => {
    try {
      const res = await API.post("/api/v1/products/search/getAllProducts", {});

      const response = res.data?.response?.products;
      setProducts(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error("❌ Error fetching products:", err);
      setToast({ name: "Error", message: "Failed to load products" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteClick = async (product) => {
    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `You are about to delete "${product.name}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await API.delete("/api/v1/products/deleteProduct", {
        data: { name: product.name },
      });

      Swal.fire({
        title: "Deleted!",
        text:
          typeof response.data?.response === "string"
            ? response.data.response
            : "Product deleted.",
        icon: "success",
      });

      fetchProducts(); // refresh list
    } catch (error) {
      console.error("Error deleting product:", error);
      Swal.fire("Error", "Failed to delete product.", "error");
    }
  };

  const handleEditClick = async (product) => {
    try {
      const res = await API.post(
        "/api/v1/products/search/name",
        { name: product.name },
        { headers: { requestId: "test" } }
      );
      const productDetails = res.data?.response;
      if (productDetails) {
        setEditingProduct(productDetails); // ⬅️ set updated product to edit
      }
    } catch (err) {
      console.error("❌ Failed to fetch product by name for edit", err);
      Swal.fire("Error", "Failed to fetch product details for edit.", "error");
    }
  };

  const handleViewClick = async (product) => {
    try {
      const res = await API.post(
        "/api/v1/products/search/name",
        { name: product.name },
        { headers: { requestId: "test" } }
      );
      const productDetails = res.data?.response;
      if (productDetails) {
        setViewProduct(productDetails);
      }
    } catch (err) {
      console.error("❌ Failed to fetch product by name", err);
      Swal.fire("Error", "Failed to fetch product details.", "error");
    }
  };

  return (
    <div className="p-6 bg-[#f9f9f9] min-h-screen">
      {/* ✅ Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4">
          <div className="bg-[#7c1d1d] text-white px-4 py-2 rounded-lg shadow-lg flex justify-between items-center gap-4 border border-red-800 min-w-[280px] max-w-md">
            <div className="text-sm truncate">
              ✅ {toast.name}: {toast.message}
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-xl leading-none"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* ✅ Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-[#7c1d1d]">
          Product Management
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#6e1414] text-white px-4 py-2 rounded-md font-bold hover:opacity-90"
        >
          Add Product
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        {/* ✅ Search Bar */}
        <input
          type="text"
          placeholder="Search by name or category"
          className="p-2 border rounded-md focus:outline-[#7c1d1d] w-full sm:w-[300px]"
        />

        <div className="flex items-center gap-3">
          {[
            {
              Icon: Filter,
              title: "Filter Products",
              onClick: () => setShowFilterModal(true),
            },
            { Icon: List, title: "Sort Options" },
            { Icon: User, title: "User-Specific Products" },
          ].map(({ Icon, title, onClick }, i) => (
            <button
              key={i}
              title={title}
              onClick={onClick}
              className="p-2 bg-white rounded shadow hover:bg-gray-100 flex items-center justify-center"
            >
              <Icon size={18} className="text-[#7c1d1d]" />
            </button>
          ))}
        </div>
      </div>
      {showFilterModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center px-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setShowFilterModal(false)}
              className="absolute top-2 right-3 text-xl font-bold text-red-500"
            >
              ✕
            </button>

            <FilterProduct
              onClear={() => {
                console.log("Cleared filters");
              }}
              onApply={(filters) => {
                console.log("Applied filters:", filters);
                // 🔥 tu yahan filter API call bhi kar sakta hai
                setShowFilterModal(false); // Close after apply
              }}
            />
          </div>
        </div>
      )}

      {/* ✅ Product Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-left">
          <thead className="bg-[#f1f1f1]">
            <tr className="text-[#7c1d1d] font-medium">
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Weight(gm)</th>
              <th className="p-3 text-center">Available Stock</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="p-4 text-center" colSpan={6}>
                  Loading...
                </td>
              </tr>
            ) : products.length > 0 ? (
              products.map((prod, index) => (
                <tr
                  key={prod.id || index}
                  className={`border-b hover:bg-gray-50 ${
                    index % 2 !== 0 ? "bg-[#f9eaea]" : "bg-white"
                  }`}
                >
                  <td className="p-3 flex items-center gap-2">{prod.name}</td>
                  <td className="p-3">₹{prod.price}</td>
                  <td className="p-3">{prod.weight}</td>
                  <td className="p-3 text-center align-middle">
                    <div className="flex justify-center items-center h-full min-h-[40px]">
                      {prod.availableStock}
                    </div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        prod.isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {prod.isAvailable ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-3 flex gap-3 text-[#7c1d1d]">
                    <FaEye
                      title="View"
                      className="text-gray-600 cursor-pointer"
                      onClick={() => handleViewClick(prod)}
                    />
                    <FaEdit
                      title="Edit"
                      className="text-blue-600 cursor-pointer"
                      onClick={() => handleEditClick(prod)}
                    />
                    <FaTrash
                      title="Delete"
                      className="text-red-600 cursor-pointer"
                      onClick={() => handleDeleteClick(prod)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4 text-center" colSpan={6}>
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-2xl p-6 relative">
              <button
                onClick={() => setEditingProduct(null)}
                className="absolute top-2 right-3 text-red-500 text-xl font-bold"
              >
                ✕
              </button>
              <EditProductForm
                product={editingProduct}
                onCancel={() => setEditingProduct(null)}
                onSuccess={fetchProducts}
                setToast={setToast}
              />
            </div>
          </div>
        )}

        {/* ✅ Pagination */}
        <div className="flex justify-between items-center text-sm text-gray-600 px-4 py-3">
          <div>
            Rows per page:{" "}
            <select
              className="border rounded px-1 py-0.5 ml-1"
              defaultValue="4"
            >
              {[1, 2, 4].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-4">
            <span>
              <strong>1–{products.length}</strong> of {products.length}
            </span>
            <button className="text-xl cursor-pointer hover:text-[#7c1d1d]">
              {"<"}
            </button>
            <button className="text-xl cursor-pointer hover:text-[#7c1d1d]">
              {">"}
            </button>
          </div>
        </div>
      </div>
      {viewProduct && (
        <ViewProductModal
          product={viewProduct}
          onClose={() => setViewProduct(null)}
        />
      )}

      {/* ✅ Add Product Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-2xl p-6 relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-3 text-red-500 text-xl font-bold"
            >
              ✕
            </button>
            <AddProductForm
              onCancel={() => setShowForm(false)}
              setToast={setToast}
            />
          </div>
        </div>
      )}
    </div>
  );
}
