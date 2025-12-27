export default function Filters({ filters, setFilters, applyFilters }) {
  return (
    <div className="border rounded bg-white p-4">
      <h3 className="font-semibold mb-4">Filters</h3>

      {/* PRICE */}
      <div className="mb-5">
        <p className="text-sm font-medium mb-2">Price</p>
        <label className="block text-sm">
          <input
            type="radio"
            name="price"
            onChange={() =>
              setFilters({ ...filters, minPrice: 0, maxPrice: 20000 })
            }
          />{" "}
          Under ₹20,000
        </label>

        <label className="block text-sm">
          <input
            type="radio"
            name="price"
            onChange={() =>
              setFilters({ ...filters, minPrice: 20000, maxPrice: 30000 })
            }
          />{" "}
          ₹20,000 – ₹30,000
        </label>
      </div>

      {/* WEIGHT */}
      <div className="mb-5">
        <p className="text-sm font-medium mb-2">Weight</p>
        <label className="block text-sm">
          <input
            type="radio"
            name="weight"
            onChange={() =>
              setFilters({ ...filters, minWeight: 0, maxWeight: 5 })
            }
          />{" "}
          Under 5g
        </label>

        <label className="block text-sm">
          <input
            type="radio"
            name="weight"
            onChange={() =>
              setFilters({ ...filters, minWeight: 5, maxWeight: 10 })
            }
          />{" "}
          5g – 10g
        </label>
      </div>

      {/* DISCOUNT */}
      <div className="mb-5">
        <p className="text-sm font-medium mb-2">Discount</p>
        <label className="block text-sm">
          <input
            type="checkbox"
            onChange={(e) =>
              setFilters({
                ...filters,
                discountPercentage: e.target.checked ? 10 : null,
              })
            }
          />{" "}
          10% or more
        </label>
      </div>

      <button
        onClick={applyFilters}
        className="w-full bg-[#7c1d1d] text-white py-2 rounded text-sm font-semibold"
      >
        Apply Filters
      </button>
    </div>
  );
}
