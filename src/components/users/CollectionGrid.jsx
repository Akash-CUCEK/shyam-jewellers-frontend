import n1 from "../../assets/n1.jpg";
import n2 from "../../assets/n2.jpg";
import n3 from "../../assets/n3.jpg";

export default function CollectionGrid() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-6">
      {/* Heading */}
      <h2 className="text-lg md:text-2xl font-semibold text-center text-[#7c1d1d]">
        Shyama Jewellers Collections
      </h2>
      <p className="text-xs md:text-sm text-center text-gray-500 mb-5">
        Explore our newly launched collection
      </p>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* LEFT IMAGE */}
        <div className="md:col-span-2 overflow-hidden rounded-xl">
          <img
            src={n1}
            alt="Necklace Collection"
            className="
              w-full
              h-[200px] sm:h-[230px] md:h-[300px]
              object-cover
              transition-transform duration-500
              hover:scale-105
            "
          />
        </div>

        {/* RIGHT STACK */}
        <div className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-xl">
            <img
              src={n2}
              alt="Earrings"
              className="
                w-full
                h-[140px] sm:h-[160px] md:h-[145px]
                object-cover
                transition-transform duration-500
                hover:scale-105
              "
            />
          </div>

          <div className="overflow-hidden rounded-xl">
            <img
              src={n3}
              alt="Chains"
              className="
                w-full
                h-[140px] sm:h-[160px] md:h-[145px]
                object-cover
                transition-transform duration-500
                hover:scale-105
              "
            />
          </div>
        </div>
      </div>
    </section>
  );
}
