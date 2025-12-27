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
  { label: "VIEW ALL", image: null, text: "10+ Categories" },
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
    <section className="max-w-6xl mx-auto px-4 py-6">
      {/* Heading */}
      <h2 className="text-lg md:text-2xl font-semibold text-center text-[#7c1d1d]">
        Find Your Perfect Match
      </h2>
      <p className="text-xs md:text-sm text-center text-gray-500 mb-6">
        Shop by Categories
      </p>

      {/* GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            onClick={() => handleClick(cat)}
            className="
              cursor-pointer
              flex flex-col items-center text-center
              border rounded-xl
              overflow-hidden
              bg-white
              transition
              hover:shadow-md
            "
          >
            {/* IMAGE / VIEW ALL */}
            {cat.image ? (
              <div className="w-full overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="
                    w-full
                    h-[120px] sm:h-[140px] md:h-[150px]
                    object-contain
                    p-3
                    transition-transform duration-500
                    hover:scale-105
                  "
                />
              </div>
            ) : (
              <div
                className="
                  w-full
                  h-[120px] sm:h-[140px] md:h-[150px]
                  flex items-center justify-center
                  bg-[#f8f3f3]
                  text-[#7c1d1d]
                  font-semibold
                  text-sm
                "
              >
                {cat.text}
              </div>
            )}

            {/* LABEL */}
            <div className="py-2 text-xs md:text-sm font-medium text-[#333]">
              {cat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
