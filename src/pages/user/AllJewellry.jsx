import React, { useState } from "react";

const filters = ["Category", "Price", "Occasion", "Gender"];

const data = {
  Category: [
    { label: "All Jewellery", image: "/images/all.png", path: "/all-jewellery" },
    { label: "Earrings", image: "/images/earrings.png", path: "/earrings" },
    { label: "Finger Rings", image: "/images/finger-rings.png", path: "/rings" },
    { label: "Mangalsutra", image: "/images/mangalsutra.png", path: "/mangalsutra" },
    { label: "Necklaces", image: "/images/necklaces.png", path: "/necklaces" },
    { label: "Bracelets", image: "/images/bracelets.png", path: "/bracelets" },
  ],
  Price: [
    { label: "<25K", image: "/images/price1.png", path: "/price/under-25k" },
    { label: "25K-50K", image: "/images/price2.png", path: "/price/25k-50k" },
    { label: "50K-1L", image: "/images/price3.png", path: "/price/50k-1l" },
    { label: "1L & Above", image: "/images/price4.png", path: "/price/1l-above" },
  ],
  Occasion: [
    { label: "Office Wear", image: "/images/office.png", path: "/occasion/office" },
    { label: "Modern Wear", image: "/images/modern.png", path: "/occasion/modern" },
    { label: "Casual Wear", image: "/images/casual.png", path: "/occasion/casual" },
    { label: "Traditional Wear", image: "/images/traditional.png", path: "/occasion/traditional" },
  ],
  Gender: [
    { label: "Women", image: "/images/women.png", path: "/gender/women" },
    { label: "Men", image: "/images/men.png", path: "/gender/men" },
    { label: "Kids & Teens", image: "/images/kids.png", path: "/gender/kids" },
  ],
};

export default function AllJewellery() {
  const [activeFilter, setActiveFilter] = useState("Category");

  const handleNavigate = (path) => {
    console.log("Navigate to:", path);

  };

  return (
    <div className="w-full bg-white shadow-xl border-t border-gray-200">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row">
      
          <div className="w-full lg:w-48 lg:flex-shrink-0 border-b lg:border-b-0 lg:border-r border-gray-200">
        
            <div className="lg:hidden px-3 py-3">
              <div className="grid grid-cols-2 gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-2 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                      activeFilter === filter
                        ? "bg-rose-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden lg:flex flex-col p-4 space-y-2">
              <h2 className="text-base font-semibold text-gray-800 mb-2">
                Filter By
              </h2>
              {filters.map((filter) => (
                <button
                  key={filter}
                  onMouseEnter={() => setActiveFilter(filter)}
                  onClick={() => setActiveFilter(filter)}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeFilter === filter
                      ? "bg-rose-50 text-rose-700 font-semibold shadow-sm border-l-4 border-rose-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-3 lg:p-6">
            {/* Grid Items */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
              {data[activeFilter]?.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleNavigate(item.path)}
                  className="cursor-pointer bg-white rounded-lg p-2 shadow-sm hover:shadow-md transition-all duration-200 group"
                >
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
                    <img
                      src={item.image}
                      alt={item.label}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f3f4f6' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <p className="text-xs font-medium text-gray-800 text-center line-clamp-2">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Promo Banner */}
            <div className="mt-4 lg:mt-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-3 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-rose-100 rounded-lg overflow-hidden">
                    <img
                      src="/images/banner.png"
                      alt="promo"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Crect fill='%23fecdd3' width='60' height='60'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23be123c' font-size='24'%3E💎%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-gray-800">
                      Jewellery for Every Moment
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      14,000+ designs to choose from
                    </p>
                  </div>
                </div>
                <button
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md flex-shrink-0"
                  onClick={() => handleNavigate("/all-jewellery")}
                >
                  View All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom styles */}
      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}