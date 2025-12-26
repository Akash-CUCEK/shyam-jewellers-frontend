import React, { useEffect, useRef, useState } from "react";
import { ImageUploader } from "../../utils/ImageUploader";
import { API } from "../../utils/API";

export default function AddProductForm({ onCancel, setToast }) {
  const formRef = useRef(null);

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

  /* 🔝 FORM OPEN → SCROLL TO TOP */
  useEffect(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  /* 📦 FETCH CATEGORIES */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/api/categories/getAllCategory");
        const list = res?.data?.response?.getCategoriesResponseDTO || [];

        // ✅ only active categories
        setCategories(list.filter((c) => c.status === true));
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };

    fetchCategories();
  }, []);

  const inputStyle =
    "border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#7c1d1d] text-[#7c1d1d]";

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (!file) return;
      setProduct({ ...product, imageFile: file });
      setPreviewImage(URL.createObjectURL(file));
      return;
    }

    // ❌ prevent negative numbers
    if (
      ["price", "discountPercentage", "weight", "quantity"].includes(name) &&
      Number(value) < 0
    ) {
      return;
    }

    setProduct({ ...product, [name]: value });
  };

  const removeImage = () => {
    setProduct({ ...product, imageFile: null });
    setPreviewImage(null);
  };

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

      const email = sessionStorage.getItem("email");

      const payload = {
        email,
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

      const res = await API.post("/api/v1/products/addProduct", payload);

      onCancel();
      setToast({
        name: "Product",
        message: "Product added successfully",
      });
    } catch (err) {
      alert("❌ Failed to add product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={formRef} className="max-h-[80vh] overflow-y-auto px-2">
      {error && (
        <div className="mb-4 bg-[#7c1d1d] text-white p-3 rounded-md">
          ⚠️ Please fill all required fields correctly
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow max-w-2xl mx-auto"
      >
        <h2 className="text-2xl font-bold text-[#7c1d1d] mb-6 text-center">
          Add New Product
        </h2>

        {/* CATEGORY */}
        <select
          name="category"
          value={product.category}
          onChange={handleChange}
          className={inputStyle}
        >
          <option value="">Select Category *</option>
          {categories.map((cat) => (
            <option key={cat.categoryId} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* PRICE & DISCOUNT */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <input
            type="number"
            name="price"
            min="0"
            placeholder="Price *"
            value={product.price}
            onChange={handleChange}
            className={inputStyle}
          />
          <input
            type="number"
            name="discountPercentage"
            min="0"
            placeholder="Discount %"
            value={product.discountPercentage}
            onChange={handleChange}
            className={inputStyle}
          />
        </div>

        {/* WEIGHT & MATERIAL */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <input
            type="number"
            name="weight"
            min="0"
            placeholder="Weight (g) *"
            value={product.weight}
            onChange={handleChange}
            className={inputStyle}
          />
          <select
            name="materialType"
            value={product.materialType}
            onChange={handleChange}
            className={inputStyle}
          >
            <option value="">Material *</option>
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
          </select>
        </div>

        {/* QUANTITY */}
        <input
          type="number"
          name="quantity"
          min="0"
          placeholder="Quantity *"
          value={product.quantity}
          onChange={handleChange}
          className={`${inputStyle} mt-4`}
        />

        {/* IMAGE */}
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="mt-4"
        />

        {previewImage && (
          <img src={previewImage} alt="preview" className="mt-2 h-24 rounded" />
        )}

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-[#7c1d1d] text-white rounded"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
