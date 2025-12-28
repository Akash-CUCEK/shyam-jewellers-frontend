import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import AddProductForm from "./AddProductForm";
import EditProductForm from "./EditProductForm";
import ViewProductModal from "./ViewProductModal";
import { API } from "../../utils/API";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);

  const fetchedOnce = useRef(false);

  /* ================= FETCH PRODUCTS ================= */
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get("/api/v1/public/getAllProducts");

      const list = res?.data?.response?.content || [];
      setProducts(list);
    } catch (err) {
      Swal.fire("Error", "Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!fetchedOnce.current) {
      fetchedOnce.current = true;
      fetchProducts();
    }
  }, []);

  /* ================= VIEW ================= */
  const handleViewClick = async (prod) => {
    if (!prod.productId) {
      Swal.fire("Error", "Invalid product id", "error");
      return;
    }

    try {
      const res = await API.get(
        `/auth/api/v1/admin/getProductById/${prod.productId}`
      );
      if (res.data?.response) {
        setViewProduct(res.data.response);
      }
    } catch {
      Swal.fire("Error", "Unable to fetch product details", "error");
    }
  };

  /* ================= EDIT ================= */
  const handleEditClick = async (prod) => {
    if (!prod.productId) {
      Swal.fire("Error", "Invalid product id", "error");
      return;
    }

    try {
      const res = await API.get(
        `/auth/api/v1/admin/getProductById/${prod.productId}`
      );
      if (res.data?.response) {
        setEditProduct(res.data.response);
      }
    } catch {
      Swal.fire("Error", "Unable to fetch product details", "error");
    }
  };

  /* ================= DELETE ================= */
  const handleDeleteClick = async (prod) => {
    const confirm = await Swal.fire({
      title: "Delete Product?",
      text: prod.name,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7c1d1d",
    });

    if (!confirm.isConfirmed) return;

    try {
      await API.delete("/auth/api/v1/admin/deleteProduct", {
        data: { productId: prod.productId },
      });

      Swal.fire("Deleted", "Product removed successfully", "success");
      fetchProducts();
    } catch {
      Swal.fire("Error", "Delete failed", "error");
    }
  };

  /* ================= FILTER ================= */
  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 bg-[#f9f9f9] min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-[#7c1d1d]">
          Product Management
        </h1>

        <button
          onClick={() => setShowAddForm(true)}
          className="bg-[#7c1d1d] text-white px-5 py-2 rounded-lg shadow"
        >
          Add Product
        </button>
      </div>

      {/* ================= SEARCH ================= */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or category..."
        className="mb-5 px-3 py-2 border rounded-lg w-full sm:w-72"
      />

      {/* ================= LOADING ================= */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-[#7c1d1d] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* ================= DESKTOP TABLE ================= */}
      {!loading && filteredProducts.length > 0 && (
        <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f1f1f1] text-sm">
              <tr>
                <th className="p-4 text-[#7c1d1d]">Name</th>
                <th className="p-4 text-[#7c1d1d]">Category</th>
                <th className="p-4 text-[#7c1d1d]">Price</th>
                <th className="p-4 text-[#7c1d1d]">Weight</th>
                <th className="p-4 text-[#7c1d1d]">Stock</th>
                <th className="p-4 text-[#7c1d1d]">Status</th>
                <th className="p-4 text-[#7c1d1d]">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((prod, i) => (
                <tr
                  key={prod.productId}
                  className={`border-t ${
                    i % 2 === 0 ? "bg-white" : "bg-[#faf0f0]"
                  }`}
                >
                  <td className="p-4 font-medium">{prod.name}</td>
                  <td className="p-4">{prod.category}</td>
                  <td className="p-4">₹{prod.price}</td>
                  <td className="p-4">{prod.weight}</td>
                  <td className="p-4">{prod.availableStock}</td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        prod.isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {prod.isAvailable ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-4 text-lg text-gray-600">
                      <FaEye
                        className="cursor-pointer"
                        onClick={() => handleViewClick(prod)}
                      />
                      <FaEdit
                        className="cursor-pointer"
                        onClick={() => handleEditClick(prod)}
                      />
                      <FaTrash
                        className="cursor-pointer text-red-600"
                        onClick={() => handleDeleteClick(prod)}
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
      {!loading && filteredProducts.length > 0 && (
        <div className="block md:hidden space-y-4">
          {filteredProducts.map((prod) => (
            <div
              key={prod.productId}
              className="bg-white rounded-xl shadow p-4 space-y-3"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-[#7c1d1d] text-lg">
                  {prod.name}
                </h3>
                <span className="text-xs font-semibold">
                  {prod.isAvailable ? "Active" : "Inactive"}
                </span>
              </div>

              <p className="text-sm">
                <b>Category:</b> {prod.category}
              </p>
              <p className="text-sm">
                <b>Price:</b> ₹{prod.price}
              </p>
              <p className="text-sm">
                <b>Weight:</b> {prod.weight}
              </p>
              <p className="text-sm">
                <b>Stock:</b> {prod.availableStock}
              </p>

              <div className="flex gap-6 pt-2 text-lg text-gray-600">
                <FaEye onClick={() => handleViewClick(prod)} />
                <FaEdit onClick={() => handleEditClick(prod)} />
                <FaTrash
                  className="text-red-600"
                  onClick={() => handleDeleteClick(prod)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= ADD ================= */}
      {showAddForm && (
        <AddProductForm
          onCancel={() => setShowAddForm(false)}
          onSuccess={(res) => {
            setShowAddForm(false);

            Swal.fire({
              toast: true,
              position: "top-end",
              icon: "success",
              title: res.name,
              text: res.message,
              timer: 2500,
              showConfirmButton: false,
            });

            fetchProducts();
          }}
        />
      )}

      {/* ================= EDIT ================= */}
      {editProduct && (
        <EditProductForm
          product={editProduct}
          onCancel={() => setEditProduct(null)}
          onSuccess={fetchProducts}
        />
      )}

      {/* ================= VIEW ================= */}
      {viewProduct && (
        <ViewProductModal
          product={viewProduct}
          onClose={() => setViewProduct(null)}
        />
      )}
    </div>
  );
}
