import { useState, useEffect } from "react";
import { API } from "@/utils/API";

export function useJewelleryListing({
  category,
  gender,
  material,
  minPrice,
  maxPrice,
  size,
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

        setProducts(res.data.response?.content || []);
        setTotalPages(res.data.response?.totalPages || 0);
        setPage(pageNo);
        return;
      }

      /* ================= PRICE FILTER ================= */
      if (minPrice || maxPrice) {
        let url = "";

        // ✅ WEDDING / PREMIUM (price >= minPrice)
        if (minPrice) {
          url = `/api/v1/public/price/above?price=${minPrice}&page=${pageNo}&size=${size}`;
        }

        // ✅ DAILY WEAR / BUDGET (price <= maxPrice)
        if (maxPrice) {
          url = `/api/v1/public/price/under?price=${maxPrice}&page=${pageNo}&size=${size}`;
        }

        const res = await API.get(url);

        setProducts(res.data.response?.content || []);
        setTotalPages(res.data.response?.totalPages || 0);
        setPage(pageNo);

        if ((res.data.response?.content || []).length === 0) {
          setErrorMessage("No products found");
        }

        return;
      }

      /* ================= GENDER ================= */
      if (gender) {
        const res = await API.post("/api/v1/public/getProductsByGender", {
          gender,
        });

        const products = res.data.response?.products || [];

        setProducts(products);
        setTotalPages(1);
        setPage(0);

        if (products.length === 0) {
          setErrorMessage(`No products found for ${gender} jewellery`);
        }
        return;
      }

      /* ================= CATEGORY / ALL ================= */
      let url = `/api/v1/public/getAllProducts?page=${pageNo}&size=${size}`;
      if (category) {
        url = `/api/v1/public/category/${category}?page=${pageNo}&size=${size}`;
      }

      const res = await API.get(url);

      setProducts(res.data.response?.content || []);
      setTotalPages(res.data.response?.totalPages || 0);
      setPage(pageNo);
    } catch (err) {
      const msg =
        err?.response?.data?.errors?.messages?.[0]?.message ||
        "No products found";

      setProducts([]);
      setTotalPages(0);
      setErrorMessage(msg);
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
