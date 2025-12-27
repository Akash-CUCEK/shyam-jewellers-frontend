import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ✅ SAME IMAGES AS CategoryGrid */
import earringsImg from "@/assets/earring.jpg";
import ringsImg from "@/assets/ring.jpg";
import mangalsutraImg from "@/assets/mangalsutra.jpg";
import chainsImg from "@/assets/chain.jpg";

/* FILTER LIST */
const filters = ["Category", "Price", "Occasion", "Gender"];

/* CATEGORY – SPECIAL ONE ROW DATA */
const categoryRow = [
  {
    label: "EARRINGS",
    image: earringsImg,
    path: "/jewellery/list?category=EARRINGS",
  },
  {
    label: "FINGER RINGS",
    image: ringsImg,
    path: "/jewellery/list?category=FINGER RINGS",
  },
  {
    label: "MANGALSUTRA",
    image: mangalsutraImg,
    path: "/jewellery/list?category=MANGALSUTRA",
  },
  {
    label: "CHAINS",
    image: chainsImg,
    path: "/jewellery/list?category=CHAINS",
  },
  {
    label: "VIEW ALL",
    image: null,
    text: "10+ Categories",
    path: "/jewellery/list",
  },
];

/* OTHER FILTER DATA – AS IT IS */
const data = {
  Price: [
    { label: "<25K", image: "/images/price1.png", path: "/price/under-25k" },
    { label: "25K-50K", image: "/images/price2.png", path: "/price/25k-50k" },
    { label: "50K-1L", image: "/images/price3.png", path: "/price/50k-1l" },
    {
      label: "1L & Above",
      image: "/images/price4.png",
      path: "/price/1l-above",
    },
  ],
  Occasion: [
    {
      label: "Office Wear",
      image: "/images/office.png",
      path: "/occasion/office",
    },
    {
      label: "Modern Wear",
      image: "/images/modern.png",
      path: "/occasion/modern",
    },
    {
      label: "Casual Wear",
      image: "/images/casual.png",
      path: "/occasion/casual",
    },
    {
      label: "Traditional Wear",
      image: "/images/traditional.png",
      path: "/occasion/traditional",
    },
  ],
  Gender: [
    { label: "Women", image: "/images/women.png", path: "/gender/women" },
    { label: "Men", image: "/images/men.png", path: "/gender/men" },
    { label: "Kids & Teens", image: "/images/kids.png", path: "/gender/kids" },
  ],
};

export default function AllJewellery() {
  const [activeFilter, setActiveFilter] = useState("Category");
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="w-full bg-white shadow-xl border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row">
          {/* LEFT FILTER */}
          <div className="w-full lg:w-48 border-b lg:border-b-0 lg:border-r border-gray-200">
            {/* MOBILE */}
            <div className="lg:hidden px-3 py-3">
              <div className="grid grid-cols-2 gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-2 py-2 rounded-full text-xs font-medium
                      ${
                        activeFilter === filter
                          ? "bg-rose-600 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* DESKTOP */}
            <div className="hidden lg:flex flex-col p-4 space-y-2">
              <h2 className="text-base font-semibold text-gray-800 mb-2">
                Filter By
              </h2>
              {filters.map((filter) => (
                <button
                  key={filter}
                  onMouseEnter={() => setActiveFilter(filter)}
                  onClick={() => setActiveFilter(filter)}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-medium
                    ${
                      activeFilter === filter
                        ? "bg-rose-50 text-rose-700 border-l-4 border-rose-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* CONTENT */}
          <div className="flex-1 p-4 lg:p-6">
            {/* ✅ CATEGORY – ONE ROW */}
            {activeFilter === "Category" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {categoryRow.map((cat, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleNavigate(cat.path)}
                    className="cursor-pointer bg-white border rounded-xl text-center
                               transition hover:shadow-md"
                  >
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.label}
                        className="w-full h-[140px] object-contain p-3
                                   transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <div
                        className="h-[140px] flex flex-col items-center
                                      justify-center bg-[#f8f3f3]
                                      text-[#7c1d1d] font-semibold text-sm"
                      >
                        {cat.text}
                      </div>
                    )}
                    <div className="py-2 text-xs font-medium text-gray-800">
                      {cat.label}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* 🔹 OTHER FILTERS – SAME AS BEFORE */
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {data[activeFilter]?.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleNavigate(item.path)}
                    className="cursor-pointer bg-white rounded-lg p-2
                               shadow-sm hover:shadow-md transition"
                  >
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
                      <img
                        src={item.image}
                        alt={item.label}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs font-medium text-center">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
