import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "@/utils/API";

const filters = ["Category", "Price", "Occasion", "Gender"];

export default function AllJewellery({ onNavigate }) {
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState("Category");
  const [homeCategories, setHomeCategories] = useState([]);

  /* ================= FETCH CATEGORY ================= */
  useEffect(() => {
    if (activeFilter === "Category") {
      fetchHomeCategories();
    }
  }, [activeFilter]);

  const fetchHomeCategories = async () => {
    try {
      const res = await API.post("/api/v1/public/getAllCategory");
      const all = res?.data?.response?.getCategoryUserResponseDTOS || [];
      const showOnHome = all.filter((c) => c.showOnHome);
      setHomeCategories(showOnHome.slice(0, 4));
    } catch {
      setHomeCategories([]);
    }
  };

  /* ================= COMMON NAVIGATE ================= */
  const go = (url) => {
    navigate(url);
    onNavigate?.(); // ✅ CLOSE DROPDOWN
  };

  /* ================= CARD ================= */
  const Card = ({ title, onClick, children }) => (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white border rounded-xl hover:shadow-lg transition flex flex-col items-center justify-center h-[140px] text-center"
    >
      {children}
      <div className="mt-2 text-xs font-semibold text-gray-800">{title}</div>
    </div>
  );

  return (
    <div className="w-full bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        {/* ================= MOBILE FILTER ================= */}
        <div className="lg:hidden px-3 py-3">
          <div className="flex gap-2 overflow-x-auto">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => {
                  setActiveFilter(f);
                  onNavigate?.(); // ✅ CLOSE DROPDOWN
                }}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap ${
                  activeFilter === f
                    ? "bg-[#7c1d1d] text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex">
          {/* ================= DESKTOP LEFT FILTER ================= */}
          <div className="hidden lg:flex w-56 border-r border-gray-200">
            <div className="p-4 space-y-2 w-full">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setActiveFilter(f);
                    onNavigate?.(); // ✅ CLOSE DROPDOWN
                  }}
                  className={`w-full px-4 py-3 rounded-lg text-left text-sm font-medium transition ${
                    activeFilter === f
                      ? "bg-[#7c1d1d] text-white"
                      : "text-gray-700 hover:bg-[#f8eaea] hover:text-[#7c1d1d]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* ================= RIGHT CONTENT ================= */}
          <div className="flex-1 p-4 lg:p-6">
            {/* CATEGORY */}
            {activeFilter === "Category" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {homeCategories.map((cat) => (
                  <Card
                    key={cat.categoryId}
                    title={cat.name}
                    onClick={() => go(`/jewellery/list?category=${cat.name}`)}
                  >
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="h-20 object-contain"
                    />
                  </Card>
                ))}

                <Card title="10+ Categories" onClick={() => go("/categories")}>
                  <span className="text-[#7c1d1d] font-bold text-sm">
                    VIEW ALL
                  </span>
                </Card>
              </div>
            )}

            {/* PRICE */}
            {activeFilter === "Price" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Card
                  title="Under ₹20K"
                  onClick={() => go("/jewellery/list?maxPrice=20000")}
                >
                  💍
                </Card>
                <Card
                  title="Under ₹50K"
                  onClick={() => go("/jewellery/list?maxPrice=50000")}
                >
                  ✨
                </Card>
                <Card
                  title="₹50K & Above"
                  onClick={() => go("/jewellery/list?minPrice=50000")}
                >
                  👑
                </Card>
              </div>
            )}

            {/* OCCASION */}
            {activeFilter === "Occasion" && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card
                  title="Daily Wear"
                  onClick={() => go("/jewellery/list?maxPrice=20000")}
                >
                  🌼
                </Card>
                <Card
                  title="Office Wear"
                  onClick={() => go("/jewellery/list?maxPrice=50000")}
                >
                  👜
                </Card>
                <Card
                  title="Casual Wear"
                  onClick={() => go("/jewellery/list?maxPrice=30000")}
                >
                  🌸
                </Card>
                <Card
                  title="Wedding"
                  onClick={() => go("/jewellery/list?minPrice=50000")}
                >
                  💒
                </Card>
              </div>
            )}

            {/* GENDER */}
            {activeFilter === "Gender" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Card
                  title="Women"
                  onClick={() => go("/jewellery/list?gender=female")}
                >
                  👩
                </Card>
                <Card
                  title="Men"
                  onClick={() => go("/jewellery/list?gender=Male")}
                >
                  👨
                </Card>
                <Card
                  title="Kids & Teens"
                  onClick={() => go("/jewellery/list?gender=Child")}
                >
                  🧒
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
