import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API } from "@/utils/API";
import { FaHeart } from "react-icons/fa";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/api/v1/public/getProductById/${id}`);
        setProduct(res.data.response);
      } catch (e) {
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500">Loading product...</div>
    );
  }

  if (!product || error) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-[#7c1d1d] underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <p className="text-xs text-gray-400 mb-6">
        Home / Jewellery / <span className="text-gray-700">Product</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* IMAGE SECTION */}
        <div className="relative">
          <div className="rounded-2xl bg-[#faf7f7] p-8 flex items-center justify-center">
            <img
              src={product.imageUrl}
              alt="Jewellery"
              className="h-[420px] object-contain"
            />
          </div>

          {/* Wishlist */}
          <button className="absolute top-6 right-6 bg-white shadow p-2 rounded-full text-gray-400 hover:text-red-500">
            <FaHeart size={18} />
          </button>
        </div>

        {/* INFO SECTION */}
        <div className="flex flex-col justify-center">
          {/* Name */}
          <h1 className="text-2xl font-semibold text-gray-900 leading-snug">
            {product.name || "Elegant Gold Jewellery"}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mt-3">
            <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded">
              4.4 ★
            </span>
            <span className="text-sm text-gray-500">1,200 Ratings</span>
            <span className="text-sm font-semibold text-[#7c1d1d]">
              ✔ Shyam Assured
            </span>
          </div>

          {/* PRICE */}
          <div className="mt-6">
            <p className="text-4xl font-bold text-gray-900">
              ₹{product.finalPrice.toLocaleString()}
            </p>

            <div className="flex items-center gap-4 mt-2">
              <span className="line-through text-gray-400">
                ₹{product.price.toLocaleString()}
              </span>
              <span className="text-green-600 font-medium">
                {product.discountPercentage}% off
              </span>
            </div>

            <p className="text-green-700 text-sm mt-3">
              Free Delivery • In Stock
            </p>
          </div>

          {/* CTA */}
          <div className="flex gap-4 mt-8">
            <button className="flex-1 bg-[#7c1d1d] text-white py-3 rounded-xl font-semibold hover:opacity-90">
              ADD TO CART
            </button>

            <button className="flex-1 bg-[#facc15] text-black py-3 rounded-xl font-semibold hover:opacity-90">
              BUY NOW
            </button>
          </div>

          {/* DETAILS CARD */}
          <div className="mt-10 border rounded-xl p-5 bg-white">
            <h3 className="font-semibold mb-3">Product Details</h3>

            <div className="grid grid-cols-2 gap-y-3 text-sm text-gray-600">
              <p>Jewellery Type</p>
              <p className="text-gray-900">Pure Gold</p>

              <p>Certification</p>
              <p className="text-gray-900">BIS Hallmarked</p>

              <p>Weight</p>
              <p className="text-gray-900">{product.weight} g</p>

              <p>Designed For</p>
              <p className="text-gray-900">
                {product.gender === "FEMALE"
                  ? "Women"
                  : product.gender === "MALE"
                  ? "Men"
                  : "Kids"}
              </p>

              <p>Stock</p>
              <p className="text-gray-900">
                {product.availableStock} Available
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
