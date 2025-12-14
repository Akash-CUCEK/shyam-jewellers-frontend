import shadi from "../../assets/shadi.jpg";
import silver from "../../assets/silver.jpg";
import gold from "../../assets/gold.jpg";
import daily from "../../assets/daily.jpg";

const categories = [
  { label: "Wedding", image: shadi },
  { label: "Silver", image: silver },
  { label: "Gold", image: gold },
  { label: "Dailywear", image: daily },
];

export default function JewelleryOccasions() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-semibold text-center text-[#7c1d1d]">
        Shyama Jewellers World
      </h2>
      <p className="text-sm text-center text-gray-500 mb-8">
        A companion for every occasion
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {categories.map((cat, index) => (
          <div
            key={index}
            className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition group bg-white"
          >
            <img
              src={cat.image}
              alt={cat.label}
              className="w-full h-60 object-contain p-2"
            />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4">
              <h3 className="text-white text-lg font-semibold">{cat.label}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
