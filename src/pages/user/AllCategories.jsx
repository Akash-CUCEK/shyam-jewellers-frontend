import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "@/utils/API";

export default function AllCategories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const fetchAllCategories = async () => {
    try {
      const res = await API.post("/api/v1/public/getAllCategory");
      const all = res?.data?.response?.categories || [];

      all.sort((a, b) => a.name.localeCompare(b.name));
      setCategories(all);
    } catch (err) {
      console.error("Failed to fetch all categories", err);
      setCategories([]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold mb-6 text-[#7c1d1d]">
        All Categories
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => navigate(`/jewellery/list?category=${cat.name}`)}
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

            <div className="py-2 text-sm font-medium">{cat.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
