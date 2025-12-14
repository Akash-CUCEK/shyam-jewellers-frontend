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
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-semibold text-center text-[#7c1d1d]">
        Curated For You
      </h2>
      <p className="text-sm text-center text-gray-500 mb-8">Shop By Gender</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {genderCategories.map((item, index) => (
          <div
            key={index}
            className="relative rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer group bg-white"
          >
            <img
              src={item.image}
              alt={item.label}
              className="w-full h-72 object-contain p-2"
            />
            <div className="absolute bottom-0 w-full bg-black/40 text-white p-4 text-lg font-medium">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
