export default function SortBar({ setFilters }) {
  return (
    <div className="flex items-center justify-between border-b pb-2 mb-4">
      <p className="text-sm text-gray-500">Sort By</p>

      <div className="flex gap-4 text-sm">
        <button
          onClick={() => setFilters((f) => ({ ...f, sortBy: null }))}
          className="font-semibold text-[#2874f0]"
        >
          Relevance
        </button>

        <button
          onClick={() =>
            setFilters((f) => ({
              ...f,
              sortBy: "PRICE",
              sortOrder: "ASC",
            }))
          }
        >
          Price ↑
        </button>

        <button
          onClick={() =>
            setFilters((f) => ({
              ...f,
              sortBy: "PRICE",
              sortOrder: "DESC",
            }))
          }
        >
          Price ↓
        </button>
      </div>
    </div>
  );
}
