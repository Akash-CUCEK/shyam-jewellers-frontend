import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ProductGrid({ products }) {
  const navigate = useNavigate();

  const openProduct = (id) => {
    navigate(`/jewellery/product/${id}`);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
      {products.map((p) => (
        <div
          key={p.id}
          onClick={() => openProduct(p.id)}
          className="
            bg-white border rounded-lg
            hover:shadow-md transition
            flex flex-col md:flex-row
            cursor-pointer
          "
        >
          {/* IMAGE */}
          <div
            className="
              relative
              w-full md:w-56
              h-44 md:h-56
              flex items-center justify-center
              border-b md:border-b-0 md:border-r
            "
          >
            <img
              src={p.imageUrl}
              alt="Jewellery"
              className="h-full object-contain transition-transform duration-300 hover:scale-105"
            />

            {/* ❤️ Wishlist (stop propagation) */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 cursor-pointer"
            >
              <FaHeart />
            </div>
          </div>

          {/* INFO */}
          <div className="flex-1 p-3 flex flex-col justify-between">
            <div>
              {/* NAME */}
              <h2 className="text-sm md:text-base font-semibold text-gray-800 line-clamp-2">
                {p.name || "Elegant Gold Earrings"}
              </h2>

              {/* RATING */}
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-green-600 text-white text-[10px] px-1.5 py-0.5 rounded">
                  4.4 ★
                </span>
                <span className="text-[11px] text-gray-500 hidden md:inline">
                  1,200 Ratings
                </span>
              </div>

              {/* HIGHLIGHTS (desktop only) */}
              <ul className="text-[11px] text-gray-600 mt-2 space-y-0.5 hidden md:block">
                <li>• BIS Hallmarked</li>
                <li>• Weight: {p.weight} g</li>
                <li>
                  • For{" "}
                  {p.gender === "FEMALE"
                    ? "Women"
                    : p.gender === "MALE"
                    ? "Men"
                    : "Kids"}
                </li>
              </ul>
            </div>

            {/* PRICE */}
            <div className="mt-2">
              <p className="text-base md:text-lg font-bold text-gray-900">
                ₹{p.finalPrice.toLocaleString()}
              </p>

              <div className="flex items-center gap-1 text-[11px]">
                <span className="line-through text-gray-400">
                  ₹{p.price.toLocaleString()}
                </span>
                <span className="text-green-600 font-medium">
                  {p.discountPercentage}% off
                </span>
              </div>

              {/* ASSURED */}
              <span className="inline-block mt-1 text-[10px] font-semibold text-[#7c1d1d] border border-[#7c1d1d] px-1.5 py-0.5 rounded">
                ✔ Shyam Assured
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
