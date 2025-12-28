import { useState, useEffect } from "react";
import { API } from "@/utils/API";

const normalizeProduct = (p) => ({
  productId: p.id,
  name: p.name,
  price: p.price,
  finalPrice: p.finalPrice,
  discountPercentage: p.discountPercentage,
  weight: p.weight,
  imageUrl: p.imageUrl,
  gender: p.gender,
  isAvailable: p.isAvailable,
  availableStock: p.availableStock,
});

export function useJewelleryListing({
  category,
  gender,
  material,
  minPrice,
  maxPrice,
  size = 12,
}) {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchProducts = async (pageNo = 0) => {
    setLoading(true);
    setErrorMessage("");

    try {
      /* ================= MATERIAL ================= */
      if (material) {
        const res = await API.get(
          `/api/v1/public/materialType/${material}?page=${pageNo}&size=${size}`
        );

        const raw = res.data.response?.content || [];
        setProducts(raw.map(normalizeProduct));
        setTotalPages(res.data.response?.totalPages || 0);
        setPage(pageNo);
        return;
      }

      /* ================= PRICE ================= */
      if (minPrice || maxPrice) {
        const url = minPrice
          ? `/api/v1/public/price/above?price=${minPrice}&page=${pageNo}&size=${size}`
          : `/api/v1/public/price/under?price=${maxPrice}&page=${pageNo}&size=${size}`;

        const res = await API.get(url);

        const raw = res.data.response?.content || [];
        setProducts(raw.map(normalizeProduct));
        setTotalPages(res.data.response?.totalPages || 0);
        setPage(pageNo);
        return;
      }

      /* ================= GENDER ================= */
      if (gender) {
        const res = await API.post("/api/v1/public/getProductsByGender", {
          gender,
        });

        const raw = res.data.response?.products || [];
        setProducts(raw.map(normalizeProduct));
        setTotalPages(1);
        setPage(0);
        return;
      }

      /* ================= CATEGORY / ALL ================= */
      let url = `/api/v1/public/getAllProducts?page=${pageNo}&size=${size}`;
      if (category) {
        url = `/api/v1/public/category/${category}?page=${pageNo}&size=${size}`;
      }

      const res = await API.get(url);

      const raw = res.data.response?.content || [];
      setProducts(raw.map(normalizeProduct));
      setTotalPages(res.data.response?.totalPages || 0);
      setPage(pageNo);
    } catch (err) {
      setProducts([]);
      setTotalPages(0);
      setErrorMessage("No products found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(0);
  }, [category, gender, material, minPrice, maxPrice]);

  return {
    products,
    page,
    totalPages,
    loading,
    errorMessage,
    fetchProducts,
  };
}
