import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { ImageUploader } from "../../utils/ImageUploader";
import { API } from "../../utils/API";

/* 🔹 Label */
const FieldLabel = ({ text, required = false }) => (
  <label className="block font-semibold text-sm text-gray-700 mb-1">
    {text}
    {required && <span className="text-red-600"> *</span>}
  </label>
);

export default function AddProductForm({ onCancel, onSuccess }) {
  const fetchedOnceRef = useRef(false);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
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

  /* ================= FETCH CATEGORIES ================= */
  useEffect(() => {
    if (fetchedOnceRef.current) return;
    fetchedOnceRef.current = true;

    const fetchCategories = async () => {
      try {
        const res = await API.post("/api/v1/public/getAllCategory");
        setCategories(res?.data?.response?.getCategoryUserResponseDTOS || []);
      } catch {
        Swal.fire("Error", "Failed to load categories", "error");
      }
    };

    fetchCategories();
  }, []);

  const inputStyle =
    "border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-[#7c1d1d]";

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (!file) return;
      setProduct((p) => ({ ...p, imageFile: file }));
      setPreviewImage(URL.createObjectURL(file));
      return;
    }

    // ⛔ block negative values
    if (
      ["price", "weight", "quantity", "discountPercentage"].includes(name) &&
      Number(value) < 0
    ) {
      return;
    }

    setProduct((p) => ({ ...p, [name]: value }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !product.category ||
      !product.price ||
      !product.weight ||
      !product.materialType ||
      !product.quantity ||
      !product.gender ||
      !product.shortDescription ||
      !product.imageFile
    ) {
      Swal.fire(
        "Validation Error",
        "Please fill all required fields",
        "warning"
      );
      return;
    }

    try {
      setLoading(true);

      const imageUrls = await ImageUploader([product.imageFile]);
      if (!imageUrls.length) throw new Error("Image upload failed");

      const payload = {
        email:
          sessionStorage.getItem("email") ||
          sessionStorage.getItem("userEmail"),
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

      const res = await API.post("/auth/api/v1/admin/addProduct", payload);

      // ✅ ONLY send response to parent
      onSuccess(res.data.response);
    } catch {
      Swal.fire("Error", "Failed to add product", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center overflow-y-auto px-3 py-6">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl max-h-[90vh] flex flex-col">
        {/* HEADER */}
        <div className="p-5 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-[#7c1d1d] text-center">
            Add New Product
          </h2>
        </div>

        {/* BODY */}
        <div className="overflow-y-auto p-5">
          <form onSubmit={handleSubmit} className="space-y-5">
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

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel text="Price" required />
                <input
                  type="number"
                  name="price"
                  min="0"
                  value={product.price}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
              <div>
                <FieldLabel text="Discount %" />
                <input
                  type="number"
                  name="discountPercentage"
                  min="0"
                  max="100"
                  value={product.discountPercentage}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel text="Weight (g)" required />
                <input
                  type="number"
                  name="weight"
                  min="0"
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
                  <option value="">Select</option>
                  <option value="Gold">Gold</option>
                  <option value="Silver">Silver</option>
                </select>
              </div>
            </div>

            <div>
              <FieldLabel text="Quantity" required />
              <input
                type="number"
                name="quantity"
                min="0"
                value={product.quantity}
                onChange={handleChange}
                className={inputStyle}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel text="Gender" required />
                <select
                  name="gender"
                  value={product.gender}
                  onChange={handleChange}
                  className={inputStyle}
                >
                  <option value="">Select</option>
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

            <div>
              <FieldLabel text="Product Image" required />
              <input type="file" accept="image/*" onChange={handleChange} />
              {previewImage && (
                <img
                  src={previewImage}
                  alt="preview"
                  className="h-24 mt-2 rounded border"
                />
              )}
            </div>
          </form>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t bg-white flex justify-end gap-3 sticky bottom-0">
          <button onClick={onCancel} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#7c1d1d] text-white px-5 py-2 rounded"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
