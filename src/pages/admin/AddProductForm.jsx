import React, { useState, useRef } from "react";
import { ImageUploader } from "../../utils/ImageUploader";
import { API } from "../../utils/API";

export default function AddProductForm({ onCancel, setToast }) {
  const [product, setProduct] = useState({
    category: "",
    price: "",
    discountPercentage: "",
    weight: "",
    materialType: "",
    shortDescription: "",
    fullDescription: "",
    gender: "",
    isAvailable: "",
    quantity: "",
    imageFile: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState(false);
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const inputStyle =
    "border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#7c1d1d] transition text-[#7c1d1d]";

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (!file) return;

      setProduct({ ...product, imageFile: file });
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setProduct({
        ...product,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const removeImage = () => {
    setProduct({ ...product, imageFile: null });
    setPreviewImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isInvalid =
      !product.category ||
      !product.price ||
      !product.weight ||
      !product.materialType ||
      !product.quantity ||
      !product.gender ||
      !product.shortDescription ||
      !product.imageFile;

    if (isInvalid) {
      setError(true);
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return;
    }

    try {
      setError(false);
      setLoading(true);

      const imageUrls = await ImageUploader([product.imageFile]);
      if (!imageUrls.length) throw new Error("Image upload failed");

      const imageUrl = imageUrls[0];

      const email = sessionStorage.getItem("email");

      const finalProduct = {
        email: email,
        category: product.category,
        price: parseFloat(product.price),
        discountPercentage: parseInt(product.discountPercentage || 0),
        weight: parseFloat(product.weight),
        materialType: product.materialType,
        gender: product.gender,
        shortDescription: product.shortDescription,
        fullDescription: product.fullDescription,
        isAvailable: product.isAvailable,
        quantity: parseInt(product.quantity),
        imageUrl: imageUrl,
      };

      const res = await API.post("/api/v1/products/addProduct", finalProduct, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status !== 200 && res.status !== 201) {
        throw new Error(res.data?.message || "Product creation failed");
      }

      const data = res.data;

      // ✅ First close the form
      onCancel();

      // ✅ Then show the toast
      setToast({
        name: data?.response?.name || "Product",
        message: data?.response?.message || "Success",
      });
    } catch (err) {
      console.error("❌ Upload/Submit failed:", err);
      alert("❌ Failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProduct({
      category: "",
      price: "",
      discountPercentage: "",
      weight: "",
      materialType: "",
      shortDescription: "",
      fullDescription: "",
      gender: "",
      isAvailable: "true",
      quantity: "",
      imageFile: null,
    });
    setPreviewImage(null);
    setError(false);
    onCancel();
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto px-2" ref={formRef}>
      {/* Alert box */}
      {error && (
        <div className="sticky top-2 z-50 mb-4 max-w-2xl mx-auto">
          <div className="bg-[#7c1d1d] text-white p-3 rounded-md text-sm flex items-center justify-between shadow-lg">
            <span>⚠️ Please fill all required fields and upload 1 image.</span>
            <button
              onClick={() => setError(false)}
              className="text-white text-lg font-bold px-2"
            >
              ❌
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg max-w-2xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-[#7c1d1d] mb-6 text-center">
          ✨ Add New Product
        </h2>

        {/* Category */}
        <div className="mb-4">
          <label className="text-sm font-semibold mb-1 block">Category *</label>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            className={inputStyle}
          >
            <option value="">Select Category</option>
            <option value="Jewellery">Jewellery</option>
            <option value="Rings">Rings</option>
            <option value="Earrings">Earrings</option>
            <option value="Bracelets">Bracelets</option>
          </select>
        </div>

        {/* Price & Discount */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-semibold mb-1 block">Price *</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1 block">
              Discount %
            </label>
            <input
              type="number"
              name="discountPercentage"
              value={product.discountPercentage}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>
        </div>

        {/* Weight & Material */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-semibold mb-1 block">
              Weight (g) *
            </label>
            <input
              type="number"
              name="weight"
              value={product.weight}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1 block">
              Material Type *
            </label>
            <select
              name="materialType"
              value={product.materialType}
              onChange={handleChange}
              className={inputStyle}
            >
              <option value="">Select Material</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Quantity */}
        <div className="mb-4">
          <label className="text-sm font-semibold mb-1 block">Quantity *</label>
          <input
            type="number"
            name="quantity"
            value={product.quantity}
            onChange={handleChange}
            className={inputStyle}
          />
        </div>

        {/* Gender & Status */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-semibold mb-1 block">Gender *</label>
            <select
              name="gender"
              value={product.gender}
              onChange={handleChange}
              className={inputStyle}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Child">Child</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold mb-1 block">Status *</label>
            <select
              name="isAvailable"
              value={product.isAvailable}
              onChange={handleChange}
              className={inputStyle}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
        </div>

        {/* Descriptions */}
        <div className="mb-4">
          <label className="text-sm font-semibold mb-1 block">
            Short Description *
          </label>
          <textarea
            name="shortDescription"
            value={product.shortDescription}
            onChange={handleChange}
            className={`${inputStyle} resize-none`}
          />
        </div>
        <div className="mb-4">
          <label className="text-sm font-semibold mb-1 block">
            Full Description
          </label>
          <textarea
            name="fullDescription"
            value={product.fullDescription}
            onChange={handleChange}
            rows={4}
            className={`${inputStyle} resize-none`}
          />
        </div>

        {/* Upload Image */}
        <div className="mb-6">
          <label className="text-sm font-semibold mb-1 block text-[#0D1B2A]">
            Upload Product Image *
          </label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="imageFile"
              className={`flex flex-col items-center justify-center w-full h-44 border-2 border-dashed ${
                product.imageFile ? "border-[#7c1d1d]" : "border-gray-300"
              } rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className={`w-10 h-10 mb-3 ${
                    product.imageFile ? "text-[#7c1d1d]" : "text-gray-400"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16V4m0 0L3 8m4-4l4 4M17 16v-4m0 0l-4 4m4-4l4 4M3 20h18"
                  />
                </svg>
                <p className="mb-1 text-sm text-gray-500">
                  <span className="font-semibold text-[#7c1d1d]">
                    Click to upload
                  </span>{" "}
                  or drag
                </p>
                <p className="text-xs text-gray-400">PNG, JPG, JPEG (only 1)</p>
              </div>
              <input
                id="imageFile"
                type="file"
                name="imageFile"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>
          </div>

          {previewImage && (
            <div className="mt-4 relative w-32 h-32">
              <img
                src={previewImage}
                alt="preview"
                className="h-full w-full object-cover rounded shadow"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute bottom-[-22px] left-1/2 transform -translate-x-1/2 text-xs text-red-600 hover:text-red-800 transition"
              >
                ❌ Remove
              </button>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:border-[#7c1d1d] hover:text-[#7c1d1d] hover:bg-[#fde8e8] transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-md shadow font-bold tracking-wide transition 
      ${
        loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-[#6e1414] hover:opacity-90"
      } 
      text-[#f1f1f1]`}
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
