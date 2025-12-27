import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "@/utils/API";

export default function CategoryGrid() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await API.post("/api/v1/public/getAllCategory");
      const allCategories = res?.data?.response?.categories || [];

      const homeCategories = allCategories.filter(
        (cat) => cat.showOnHome === true
      );

      setCategories(homeCategories);
    } catch (err) {
      console.error("Failed to fetch categories", err);
      setCategories([]);
    }
  };
  const handleClick = (cat) => {
    navigate(`/jewellery/list?category=${cat.name}`);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-lg md:text-2xl font-semibold text-center text-[#7c1d1d]">
        Find Your Perfect Match
      </h2>
      <p className="text-xs md:text-sm text-center text-gray-500 mb-6">
        Shop by Categories
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => handleClick(cat)}
            className="
              cursor-pointer
              flex flex-col items-center text-center
              border rounded-xl
              bg-white
              hover:shadow-md
            "
          >
            <div className="w-full h-[150px] flex items-center justify-center p-3">
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="object-contain h-full"
              />
            </div>

            <div className="py-2 text-xs md:text-sm font-medium">
              {cat.name}
            </div>
          </div>
        ))}

        {/* 🔥 VIEW ALL FIXED BOX */}
        <div
          onClick={() => navigate("/categories")}
          className="
            cursor-pointer
            flex flex-col items-center justify-center
            border rounded-xl
            bg-[#f8f3f3]
            text-[#7c1d1d]
            font-semibold
          "
        >
          <div className="h-[150px] flex items-center justify-center">
            10+ Categories
          </div>
          <div className="py-2 text-sm">VIEW ALL</div>
        </div>
      </div>
    </section>
  );
}
