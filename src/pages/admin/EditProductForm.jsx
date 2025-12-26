import React, { useRef, useState } from "react";
import { ImageUploader } from "../../utils/ImageUploader";
import { API } from "../../utils/API";

/* 🔹 Reusable Label */
const FieldLabel = ({ text, required = false }) => (
  <label className="font-semibold text-sm text-gray-700">
    {text}
    {required && <span className="text-red-600"> *</span>}
  </label>
);

export default function EditProductForm({
  product,
  onCancel,
  onSuccess,
  setToast,
}) {
  const fileInputRef = useRef(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    imageUrl: product.imageUrl || "",
    imageFile: null,
  });

  const inputStyle =
    "border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#7c1d1d]";

  /* 🔁 HANDLE INPUT */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : ["price", "discountPercentage", "weight", "quantity"].includes(name)
          ? Number(value)
          : value,
    }));
  };

  /* 🖼 IMAGE CHANGE */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      imageFile: file,
      imageUrl: URL.createObjectURL(file),
    }));
  };

  /* ✅ SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.name ||
      !formData.category ||
      !formData.price ||
      !formData.weight ||
      !formData.materialType ||
      !formData.shortDescription
    ) {
      setError("Please fill all required fields marked with *");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = formData.imageUrl;

      if (formData.imageFile) {
        const uploaded = await ImageUploader([formData.imageFile]);
        if (!uploaded.length) throw new Error("Image upload failed");
        imageUrl = uploaded[0];
      }

      const payload = {
        productId: product.productId,
        email: sessionStorage.getItem("email"),
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        discountPercentage: Number(formData.discountPercentage || 0),
        weight: Number(formData.weight),
        materialType: formData.materialType,
        shortDescription: formData.shortDescription,
        fullDescription: formData.fullDescription,
        gender: formData.gender,
        isAvailable: formData.isAvailable,
        quantity: Number(formData.quantity),
        imageUrl,
      };

      await API.put("/api/v1/products/updateProduct", payload);

      setToast({
        name: "Success",
        message: "Product updated successfully",
      });

      onSuccess();
      onCancel();
    } catch (err) {
      console.error(err);
      setError("Failed to update product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-xl shadow-lg flex flex-col">
        {error && (
          <div className="bg-[#7c1d1d] text-white px-4 py-3 text-sm font-medium rounded-t-xl flex justify-between">
            <span>{error}</span>
            <button onClick={() => setError("")}>✕</button>
          </div>
        )}

        <div className="p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold text-[#7c1d1d] mb-6 text-center">
            Edit Product
          </h2>

          {/* IMAGE */}
          <div className="flex justify-center mb-6">
            <div
              className="relative w-40 h-32 border-2 border-dashed rounded cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              <img
                src={formData.imageUrl || "/placeholder.jpg"}
                alt="preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 flex items-center justify-center">
                <span className="text-white text-sm">Change</span>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* BASIC DETAILS */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel text="Product Name" required />
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>

              <div>
                <FieldLabel text="Category" required />
                <input
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>

              <div>
                <FieldLabel text="Price" required />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>

              <div>
                <FieldLabel text="Weight (g)" required />
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>

              <div>
                <FieldLabel text="Material Type" required />
                <input
                  name="materialType"
                  value={formData.materialType}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>

              <div>
                <FieldLabel text="Quantity" />
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
            </div>

            {/* DESCRIPTIONS */}
            <div>
              <FieldLabel text="Short Description" required />
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                className={inputStyle}
              />
            </div>

            <div>
              <FieldLabel text="Full Description" />
              <textarea
                name="fullDescription"
                value={formData.fullDescription}
                onChange={handleChange}
                className={inputStyle}
              />
            </div>

            {/* GENDER + STATUS */}
            <div className="flex justify-between items-end gap-4">
              <div className="flex-1">
                <FieldLabel text="Gender" />
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={inputStyle}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>

              <label className="flex items-center gap-2 mt-6">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                />
                Available
              </label>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-4 pt-4">
              <button type="button" onClick={onCancel}>
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#7c1d1d] text-white px-4 py-2 rounded"
              >
                {loading ? "Updating..." : "Update Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
