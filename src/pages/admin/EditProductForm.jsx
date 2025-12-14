import React, { useState, useRef } from "react";
import { API } from "../../utils/API";

export default function EditProductForm({
  product,
  onCancel,
  onSuccess,
  setToast,
}) {
  const [formData, setFormData] = useState({
    name: product.name || "",
    category: product.category || "",
    price: product.price || 0,
    discountPercentage: product.discountPercentage || 0,
    weight: product.weight || 0,
    materialType: product.materialType || "",
    shortDescription: product.shortDescription || "",
    fullDescription: product.fullDescription || "",
    gender: product.gender || "",
    isAvailable: product.isAvailable ?? true,
    quantity: product.quantity || 0,
    availableStock: product.availableStock || 0,
    imageUrl: product.imageUrl || "",
    updatedBy: "admin",
  });

  const inputStyle =
    "border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#7c1d1d] transition text-[#7c1d1d]";

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : [
              "price",
              "discountPercentage",
              "weight",
              "availableStock",
              "quantity",
            ].includes(name)
          ? Number(value)
          : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        imageUrl, // this is only for preview
        imageFile: file, // store actual file to send
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      for (const key in formData) {
        if (formData[key] !== undefined) {
          form.append(key, formData[key]);
        }
      }

      const res = await API.put("/api/v1/products/updateProduct", form, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setToast({
        name: "Success",
        message: res.data?.response?.message || "Product updated successfully",
      });

      onSuccess();
      onCancel();
    } catch (err) {
      console.error("❌ Update error:", err);
      setToast({
        name: "Error",
        message: "Failed to update product",
      });
    }
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto p-4 bg-white rounded-xl shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-[#7c1d1d] mb-6 text-center">
          ✏️ Edit Product
        </h2>

        {/* 🔥 Image Preview and Upload */}
        <div className="flex justify-center mb-6">
          <div
            className="relative w-40 h-32 rounded-md overflow-hidden border-2 border-dashed border-gray-400 group cursor-pointer"
            onClick={() => fileInputRef.current.click()}
          >
            <img
              src={formData.imageUrl || "/placeholder.jpg"}
              alt="Product"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
              <span className="text-white text-sm font-semibold">Change</span>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {/* 🔥 Form Fields */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Name", name: "name", type: "text" },
            { label: "Category", name: "category", type: "text" },
            { label: "Price", name: "price", type: "number" },
            {
              label: "Discount (%)",
              name: "discountPercentage",
              type: "number",
            },
            { label: "Weight (g)", name: "weight", type: "number" },
            { label: "Material Type", name: "materialType", type: "text" },
            {
              label: "Available Stock",
              name: "availableStock",
              type: "number",
            },
            { label: "Quantity", name: "quantity", type: "number" },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="text-sm font-semibold mb-1 block">
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className={inputStyle}
                required={["name", "category", "price"].includes(name)}
              />
            </div>
          ))}
        </div>

        <div className="mb-4">
          <label className="text-sm font-semibold mb-1 block">
            Short Description
          </label>
          <input
            type="text"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            className={inputStyle}
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-semibold mb-1 block">
            Full Description
          </label>
          <textarea
            name="fullDescription"
            value={formData.fullDescription}
            onChange={handleChange}
            rows={4}
            className={`${inputStyle} resize-none`}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold mb-1 block">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={inputStyle}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>

          <div className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
              className="accent-[#7c1d1d]"
            />
            <label className="font-medium text-sm">Is Available?</label>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#7c1d1d] text-white rounded hover:opacity-90"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
}
