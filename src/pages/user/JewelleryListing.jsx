import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { API } from "@/utils/API";
import Filters from "./Filters";
import SortBar from "./SortBar";
import ProductGrid from "./ProductGrid";

export default function JewelleryListing() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const size = 12;
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    minPrice: null,
    maxPrice: null,
    minWeight: null,
    maxWeight: null,
    discountPercentage: null,
    gender: null,
    sortBy: null,
    sortOrder: null,
  });

  /* ================= APPLY FILTERS ================= */
  const applyFilters = async (pageNo = 0) => {
    setLoading(true);
    try {
      const res = await API.post(
        `/api/v1/public/getProductsByFilter?page=${pageNo}&size=${size}`,
        {
          ...filters,
          category,
        }
      );

      setProducts(res.data.response.content || []);
      setTotalPages(res.data.response.totalPages || 0);
      setPage(pageNo);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= INITIAL LOAD ================= */
  const fetchInitial = async () => {
    setLoading(true);
    try {
      let url = `/api/v1/public/getAllProducts?page=0&size=${size}`;
      if (category) {
        url = `/api/v1/public/category/${category}?page=0&size=${size}`;
      }

      const res = await API.get(url);
      setProducts(res.data.response.content || []);
      setTotalPages(res.data.response.totalPages || 0);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitial();
  }, [category]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <p className="text-xs text-gray-500 mb-1">
        Home / Jewellery /{" "}
        <span className="font-medium">{category || "All"}</span>
      </p>

      <h1 className="text-lg font-semibold mb-4">
        {category || "All Jewellery"} ({products.length})
      </h1>

      <div className="flex gap-6">
        <div className="hidden md:block w-64 shrink-0">
          <Filters
            filters={filters}
            setFilters={setFilters}
            applyFilters={applyFilters}
          />
        </div>

        <div className="flex-1">
          <SortBar setFilters={setFilters} />

          {loading && (
            <div className="py-10 text-center text-gray-500">
              Loading products...
            </div>
          )}

          {!loading && <ProductGrid products={products} />}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => applyFilters(i)}
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
