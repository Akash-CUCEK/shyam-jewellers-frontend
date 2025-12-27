import shadi from "../../assets/shadi.jpg";
import silver from "../../assets/silver.jpg";
import gold from "../../assets/gold.jpg";
import daily from "../../assets/daily.jpg";

const categories = [
  { label: "Wedding", image: shadi },
  { label: "Silver", image: silver },
  { label: "Gold", image: gold },
  { label: "Daily Wear", image: daily },
];

export default function JewelleryOccasions() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-6">
      {/* Heading */}
      <h2 className="text-lg md:text-2xl font-semibold text-center text-[#7c1d1d]">
        Shyama Jewellers World
      </h2>
      <p className="text-xs md:text-sm text-center text-gray-500 mb-6">
        A companion for every occasion
      </p>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories.map((cat, index) => (
          <div
            key={index}
            className="
              relative
              rounded-xl
              overflow-hidden
              bg-white
              border
              transition
              hover:shadow-md
              group
            "
          >
            {/* IMAGE */}
            <img
              src={cat.image}
              alt={cat.label}
              className="
                w-full
                h-[180px] sm:h-[220px] md:h-[240px]
                object-cover
                transition-transform duration-500
                group-hover:scale-105
              "
            />

            {/* GRADIENT OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>

            {/* LABEL */}
            <div className="absolute bottom-0 left-0 w-full p-3">
              <h3 className="text-white text-sm md:text-lg font-semibold tracking-wide">
                {cat.label}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
