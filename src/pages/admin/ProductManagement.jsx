import React, { useState, useEffect } from "react";
import AddProductForm from "./AddProductForm";
import { Filter, List, User } from "lucide-react";
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

  // ✅ Delete product
  const handleDeleteClick = async (product) => {
    const result = await Swal.fire({
      title: "Are you sure?",
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

      Swal.fire(
        "Deleted!",
        response.data?.response || "Product deleted.",
        "success"
      );

      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      Swal.fire("Error", "Failed to delete product.", "error");
    }
  };

  // ✅ EDIT PRODUCT (FIXED)
  const handleEditClick = async (product) => {
    try {
      const res = await API.post("/api/v1/products/search/name", {
        name: product.name,
      });

      const productDetails = res.data?.response;
      if (productDetails) {
        setEditingProduct(productDetails);
      }
    } catch (err) {
      console.error("❌ Failed to fetch product for edit", err);
      Swal.fire("Error", "Failed to fetch product details.", "error");
    }
  };

  // ✅ VIEW PRODUCT (FIXED)
  const handleViewClick = async (product) => {
    try {
      const res = await API.post("/api/v1/products/search/name", {
        name: product.name,
      });

      const productDetails = res.data?.response;
      if (productDetails) {
        setViewProduct(productDetails);
      }
    } catch (err) {
      console.error("❌ Failed to fetch product", err);
      Swal.fire("Error", "Failed to fetch product details.", "error");
    }
  };

  return (
    <div className="p-6 bg-[#f9f9f9] min-h-screen">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-[#7c1d1d] text-white px-4 py-2 rounded-lg shadow flex gap-4">
            <span>
              {toast.name}: {toast.message}
            </span>
            <button onClick={() => setToast(null)}>&times;</button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-[#7c1d1d]">
          Product Management
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#6e1414] text-white px-4 py-2 rounded-md font-bold"
        >
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search by name or category"
          className="p-2 border rounded-md w-[300px]"
        />
        <div className="flex gap-2">
          <button onClick={() => setShowFilterModal(true)}>
            <Filter />
          </button>
          <button>
            <List />
          </button>
          <button>
            <User />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#f1f1f1] text-[#7c1d1d]">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Weight</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : products.length ? (
              products.map((prod, idx) => (
                <tr key={idx} className={idx % 2 ? "bg-[#f9eaea]" : ""}>
                  <td className="p-3">{prod.name}</td>
                  <td className="p-3">₹{prod.price}</td>
                  <td className="p-3">{prod.weight}</td>
                  <td className="p-3">{prod.availableStock}</td>
                  <td className="p-3">
                    {prod.isAvailable ? "Active" : "Inactive"}
                  </td>
                  <td className="p-3 flex gap-3">
                    <FaEye onClick={() => handleViewClick(prod)} />
                    <FaEdit onClick={() => handleEditClick(prod)} />
                    <FaTrash onClick={() => handleDeleteClick(prod)} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {showForm && (
        <AddProductForm
          onCancel={() => setShowForm(false)}
          setToast={setToast}
        />
      )}

      {editingProduct && (
        <EditProductForm
          product={editingProduct}
          onCancel={() => setEditingProduct(null)}
          onSuccess={fetchProducts}
          setToast={setToast}
        />
      )}

      {viewProduct && (
        <ViewProductModal
          product={viewProduct}
          onClose={() => setViewProduct(null)}
        />
      )}

      {showFilterModal && (
        <FilterProduct onClose={() => setShowFilterModal(false)} />
      )}
    </div>
  );
}
