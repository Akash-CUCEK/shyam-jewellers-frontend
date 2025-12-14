import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const filters = ["Category", "Price", "Occasion", "Gender"];

const data = {
  Category: [
    {
      label: "All Jewellery",
      image: "/images/all.png",
      path: "/all-jewellery",
    },
    { label: "Earrings", image: "/images/earrings.png", path: "/earrings" },
    {
      label: "Finger Rings",
      image: "/images/finger-rings.png",
      path: "/rings",
    },
    {
      label: "Mangalsutra",
      image: "/images/mangalsutra.png",
      path: "/mangalsutra",
    },
    { label: "Necklaces", image: "/images/necklaces.png", path: "/necklaces" },
    { label: "Bracelets", image: "/images/bracelets.png", path: "/bracelets" },
  ],
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

export default function AllJewellry() {
  const [activeFilter, setActiveFilter] = useState("Category");
  const [lockedFilter, setLockedFilter] = useState(null);
  const navigate = useNavigate();

  const handleFilterHover = (filter) => {
    if (!lockedFilter) setActiveFilter(filter);
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    setLockedFilter(filter);
  };

  return (
    <div className="w-full bg-white shadow-xl border-t border-gray-200 flex">
      {/* Left Filter Panel */}
      <div className="w-1/6 border-r p-4 flex flex-col gap-4">
        {filters.map((filter) => (
          <button
            key={filter}
            onMouseEnter={() => handleFilterHover(filter)}
            onClick={() => handleFilterClick(filter)}
            className={`text-left px-4 py-2 rounded-md transition-all ${
              activeFilter === filter
                ? "bg-rose-100 text-rose-600 font-semibold shadow-md"
                : "hover:bg-gray-50 text-gray-600"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Content Panel */}
      <div className="w-5/6 p-6">
        <div className="grid grid-cols-4 gap-6">
          {data[activeFilter]?.map((item, index) => (
            <div
              key={index}
              className="cursor-pointer text-center"
              onClick={() => navigate(item.path)}
            >
              <img
                src={item.image}
                alt={item.label}
                className="mx-auto h-28 w-28 object-cover rounded-lg shadow-sm hover:scale-105 transition-transform"
              />
              <p className="mt-2 text-sm font-medium text-gray-800">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* Promo Section */}
        <div className="mt-6 flex justify-between items-center bg-amber-50 p-4 rounded-md">
          <div className="flex items-center gap-4">
            <img
              src="/images/banner.png"
              alt="promo"
              className="h-16 rounded"
            />
            <div>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">
                  Jewellery for Every Moment—
                </span>
                See It All Here!
              </p>
              <p className="text-xs text-gray-400">
                14,000+ designs to choose from
              </p>
            </div>
          </div>
          <button
            className="bg-rose-700 text-white text-sm px-6 py-2 rounded-md hover:bg-rose-800"
            onClick={() => navigate("/all-jewellery")}
          >
            View All
          </button>
        </div>
      </div>
    </div>
  );
}
