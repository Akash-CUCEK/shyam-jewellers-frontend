import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { API } from "@/utils/API";

export default function JewelleryListing() {
  const [searchParams] = useSearchParams();

  const category = searchParams.get("category");

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const size = 12;
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH PRODUCTS ================= */
  const fetchProducts = async (pageNo = 0) => {
    setLoading(true);
    try {
      let url = `/api/v1/public/getAllProducts?page=${pageNo}&size=${size}`;

      if (category) {
        url = `/api/v1/public/category/${category}?page=${pageNo}&size=${size}`;
      }

      const res = await API.get(url);

      setProducts(res.data.response.content || []);
      setTotalPages(res.data.response.totalPages || 0);
      setPage(pageNo);
    } catch (err) {
      console.error("Error loading products", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(0);
  }, [category]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-xl font-semibold text-[#7c1d1d] mb-4">
        {category ? category.replace("_", " ") : "All Jewellery"}
      </h2>

      {loading && (
        <div className="text-center py-10 text-gray-500">
          Loading products...
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="text-center py-10 text-gray-500">No products found</div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {products.map((p) => (
          <div
            key={p.id}
            className="border rounded-lg shadow-sm hover:shadow-md transition bg-white"
          >
            <img
              src={p.imageUrl}
              alt={p.name}
              className="w-full h-44 object-contain p-3"
            />

            <div className="p-3">
              <p className="text-sm font-medium line-clamp-2">{p.name}</p>

              <div className="mt-1">
                <span className="font-semibold text-[#7c1d1d]">
                  ₹{p.finalPrice}
                </span>
                {p.discountPercentage && (
                  <span className="text-xs text-green-600 ml-2">
                    {p.discountPercentage}% OFF
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-500 mt-1">Weight: {p.weight} g</p>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            disabled={page === 0}
            onClick={() => fetchProducts(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => fetchProducts(i)}
              className={`px-3 py-1 border rounded ${
                page === i ? "bg-[#7c1d1d] text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages - 1}
            onClick={() => fetchProducts(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
