// ✅ Create a new component: ViewProductModal.jsx
import React from "react";

export default function ViewProductModal({ product, onClose }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-red-500 text-xl font-bold"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold text-[#7c1d1d] mb-4">
          Product Details
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Name:</strong> {product.name}
          </div>
          <div>
            <strong>Category:</strong> {product.category}
          </div>
          <div>
            <strong>Price:</strong> ₹{product.price}
          </div>
          <div>
            <strong>Stock:</strong> {product.stock}
          </div>
          <div>
            <strong>Available Stock:</strong> {product.availableStock}
          </div>
          <div>
            <strong>Weight:</strong> {product.weight} gm
          </div>
          <div>
            <strong>Material Type:</strong> {product.materialType}
          </div>
          <div>
            <strong>SKU:</strong> {product.skuCode}
          </div>
          <div>
            <strong>Gender:</strong> {product.gender}
          </div>
          <div>
            <strong>Avg. Rating:</strong> {product.averageRating}
          </div>
          <div>
            <strong>Status:</strong>{" "}
            {product.isAvailable ? "Active" : "Inactive"}
          </div>
          <div className="col-span-2">
            <strong>Short Description:</strong>
            <p className="text-gray-700">{product.shortDescription}</p>
          </div>
          <div className="col-span-2">
            <strong>Full Description:</strong>
            <p className="text-gray-700 whitespace-pre-wrap">
              {product.fullDescription}
            </p>
          </div>
        </div>
        {product.imageUrl && (
          <div className="mt-4 text-center">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="max-w-full max-h-64 object-contain mx-auto border rounded"
            />
          </div>
        )}
      </div>
    </div>
  );
}
