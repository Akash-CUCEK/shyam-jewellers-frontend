import React from "react";
import { useSearchParams } from "react-router-dom";
import Filters from "./Filters";
import SortBar from "./SortBar";
import ProductGrid from "./ProductGrid";
import { useJewelleryListing } from "@/hooks/useJewelleryListing";

export default function JewelleryListing() {
  const [searchParams] = useSearchParams();

  const category = searchParams.get("category");
  const gender = searchParams.get("gender");
  const material = searchParams.get("material");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  const size = 12;

  const { products, page, totalPages, loading, errorMessage, fetchProducts } =
    useJewelleryListing({
      category,
      gender,
      material,
      minPrice,
      maxPrice,
      size,
    });

  // 🔹 Dynamic title for UX
  const pageTitle = material
    ? `${material} Jewellery`
    : minPrice
    ? "Wedding Jewellery"
    : maxPrice
    ? "Daily Wear Jewellery"
    : gender
    ? `${gender} Jewellery`
    : category || "All Jewellery";

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <p className="text-xs text-gray-500 mb-1">
        Home / Jewellery / <span className="font-medium">{pageTitle}</span>
      </p>

      <h1 className="text-lg font-semibold mb-4">
        {pageTitle} ({products.length})
      </h1>

      <div className="flex gap-6">
        {/* FILTERS */}
        <div className="hidden md:block w-64 shrink-0">
          <Filters applyFilters={fetchProducts} />
        </div>

        {/* PRODUCTS */}
        <div className="flex-1">
          <SortBar />

          {/* LOADING */}
          {loading && (
            <div className="py-10 text-center text-gray-500">
              Loading products...
            </div>
          )}

          {/* EMPTY / ERROR */}
          {!loading && errorMessage && (
            <div className="py-12 text-center">
              <p className="text-lg font-medium text-gray-600">
                {errorMessage}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Please try another option
              </p>
            </div>
          )}

          {/* GRID */}
          {!loading && !errorMessage && <ProductGrid products={products} />}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
