import women from "../../assets/women.jpg";
import men from "../../assets/men.jpg";
import child from "../../assets/child.jpg";

const genderCategories = [
  { label: "Women Jewellery", image: women },
  { label: "Men Jewellery", image: men },
  { label: "Kids Jewellery", image: child },
];

export default function CuratedGenderSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-6">
      {/* Heading */}
      <h2 className="text-lg md:text-2xl font-semibold text-center text-[#7c1d1d]">
        Curated For You
      </h2>
      <p className="text-xs md:text-sm text-center text-gray-500 mb-6">
        Shop By Gender
      </p>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {genderCategories.map((item, index) => (
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
              cursor-pointer
              group
            "
          >
            {/* IMAGE */}
            <img
              src={item.image}
              alt={item.label}
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
                {item.label}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
