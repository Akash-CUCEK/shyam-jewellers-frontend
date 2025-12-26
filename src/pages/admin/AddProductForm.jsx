import React, { useEffect, useRef, useState } from "react";
import { ImageUploader } from "../../utils/ImageUploader";
import { API } from "../../utils/API";

/* 🔹 Reusable Label */
const FieldLabel = ({ text, required = false }) => (
  <label className="font-semibold text-sm text-gray-700">
    {text}
    {required && <span className="text-red-600"> *</span>}
  </label>
);

export default function AddProductForm({ onCancel, setToast }) {
  const modalRef = useRef(null);
  const fetchedOnceRef = useRef(false);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const [product, setProduct] = useState({
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

  /* 📦 FETCH CATEGORIES */
  useEffect(() => {
    if (fetchedOnceRef.current) return;
    fetchedOnceRef.current = true;

    const fetchCategories = async () => {
      try {
        const res = await API.post("/api/categories/getAllCategory");
        const list = res?.data?.response?.getCategoriesResponseDTO || [];
        setCategories(list.filter((c) => c.status === true));
      } catch (err) {
        console.error("❌ Failed to load categories", err);
      }
    };

    fetchCategories();
  }, []);

  const inputStyle =
    "border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#7c1d1d]";

  /* 🔁 HANDLE CHANGE */
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (!file) return;
      setProduct((prev) => ({ ...prev, imageFile: file }));
      setPreviewImage(URL.createObjectURL(file));
      return;
    }

    if (
      ["price", "discountPercentage", "weight", "quantity"].includes(name) &&
      Number(value) < 0
    ) {
      return;
    }

    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  /* ✅ SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const invalid =
      !product.category ||
      !product.price ||
      !product.weight ||
      !product.materialType ||
      !product.quantity ||
      !product.gender ||
      !product.shortDescription ||
      !product.imageFile;

    if (invalid) {
      setError(true);
      return;
    }

    try {
      setLoading(true);
      setError(false);

      const imageUrls = await ImageUploader([product.imageFile]);
      if (!imageUrls.length) throw new Error("Image upload failed");

      const payload = {
        email: sessionStorage.getItem("email"),
        category: product.category,
        price: Number(product.price),
        discountPercentage: Number(product.discountPercentage || 0),
        weight: Number(product.weight),
        materialType: product.materialType,
        gender: product.gender,
        shortDescription: product.shortDescription,
        fullDescription: product.fullDescription,
        isAvailable: product.isAvailable === "true",
        quantity: Number(product.quantity),
        imageUrl: imageUrls[0],
      };

      await API.post("/api/v1/products/addProduct", payload);

      onCancel();
      setToast({
        name: "Product",
        message: "added successfully",
      });
    } catch (err) {
      console.error("❌ Failed to add product", err);
      alert("❌ Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center overflow-y-auto pt-10">
      <div
        ref={modalRef}
        className="bg-white w-full max-w-2xl rounded-xl p-6 shadow-lg"
      >
        <h2 className="text-2xl font-bold text-[#7c1d1d] mb-6 text-center">
          Add New Product
        </h2>

        {error && (
          <div className="mb-4 bg-red-600 text-white p-2 rounded">
            ⚠️ Please fill all required fields
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* CATEGORY */}
          <div>
            <FieldLabel text="Category" required />
            <select
              name="category"
              value={product.category}
              onChange={handleChange}
              className={inputStyle}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.categoryId} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* PRICE & DISCOUNT */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel text="Price" required />
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                className={inputStyle}
              />
            </div>

            <div>
              <FieldLabel text="Discount Percentage" />
              <input
                type="number"
                name="discountPercentage"
                value={product.discountPercentage}
                onChange={handleChange}
                className={inputStyle}
              />
            </div>
          </div>

          {/* WEIGHT & MATERIAL */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel text="Weight (g)" required />
              <input
                type="number"
                name="weight"
                value={product.weight}
                onChange={handleChange}
                className={inputStyle}
              />
            </div>

            <div>
              <FieldLabel text="Material Type" required />
              <select
                name="materialType"
                value={product.materialType}
                onChange={handleChange}
                className={inputStyle}
              >
                <option value="">Select Material</option>
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
              </select>
            </div>
          </div>

          {/* QUANTITY */}
          <div>
            <FieldLabel text="Quantity" required />
            <input
              type="number"
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>

          {/* GENDER & STATUS */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel text="Gender" required />
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
              <FieldLabel text="Status" />
              <select
                name="isAvailable"
                value={product.isAvailable}
                onChange={handleChange}
                className={inputStyle}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          {/* DESCRIPTIONS */}
          <div>
            <FieldLabel text="Short Description" required />
            <textarea
              name="shortDescription"
              value={product.shortDescription}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>

          <div>
            <FieldLabel text="Full Description" />
            <textarea
              name="fullDescription"
              value={product.fullDescription}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>

          {/* IMAGE */}
          <div>
            <FieldLabel text="Product Image" required />
            <input type="file" accept="image/*" onChange={handleChange} />
            {previewImage && (
              <img
                src={previewImage}
                alt="preview"
                className="h-24 rounded mt-2"
              />
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#7c1d1d] text-white px-4 py-2 rounded"
            >
              {loading ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
