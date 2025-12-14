import n1 from "../../assets/n1.jpg";
import n2 from "../../assets/n2.jpg";
import n3 from "../../assets/n3.jpg";

export default function CollectionGrid() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold text-center text-[#7c1d1d]">
        Shyama Jewellers Collections
      </h2>
      <p className="text-sm text-center text-gray-500 mb-8">
        Explore our newly launched collection
      </p>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Left large image */}
        <div className="md:col-span-2">
          <img
            src={n1}
            alt="Sparkling Avenues"
            className="rounded-lg w-full object-cover"
          />
        </div>

        {/* Right two stacked small images */}
        <div className="flex flex-col gap-4">
          <img
            src={n2}
            alt="Earrings"
            className="rounded-lg w-full object-cover h-full"
          />
          <img
            src={n3}
            alt="Chains"
            className="rounded-lg w-full object-cover h-full"
          />
        </div>
      </div>
    </section>
  );
}
