import { useNavigate } from "react-router-dom";

import earringsImg from "@/assets/earring.jpg";
import ringsImg from "@/assets/ring.jpg";
import payal from "@/assets/payal.jpg";
import mangalsutraImg from "@/assets/mangalsutra.jpg";
import nosepin from "@/assets/nosepin.png";
import banglesImg from "@/assets/bangles.jpg";
import chainsImg from "@/assets/chain.jpg";

const categories = [
  { label: "EARRINGS", image: earringsImg },
  { label: "FINGER RINGS", image: ringsImg },
  { label: "PAYAL", image: payal },
  { label: "MANGALSUTRA", image: mangalsutraImg },
  { label: "NOSEPIN", image: nosepin },
  { label: "BANGLES", image: banglesImg },
  { label: "CHAINS", image: chainsImg },
  { label: "VIEW ALL", image: null, text: "10+ Categories to choose from" },
];

export default function CategoryGrid() {
  const navigate = useNavigate();

  const handleClick = (cat) => {
    if (cat.label === "VIEW ALL") {
      navigate("/jewellery/list");
    } else {
      navigate(`/jewellery/list?category=${cat.label}`);
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-semibold text-center text-[#7c1d1d]">
        Find Your Perfect Match
      </h2>
      <p className="text-sm text-center text-gray-500 mb-8">
        Shop by Categories
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            onClick={() => handleClick(cat)}
            className="cursor-pointer flex flex-col items-center text-center border rounded-lg overflow-hidden shadow hover:shadow-md transition"
          >
            {cat.image ? (
              <img
                src={cat.image}
                alt={cat.label}
                className="w-full h-40 object-contain bg-white p-2"
              />
            ) : (
              <div className="w-full h-40 flex items-center justify-center bg-gray-100 text-[#7c1d1d] font-bold text-xl">
                {cat.text}
              </div>
            )}
            <div className="py-3 font-medium text-sm text-[#333]">
              {cat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
