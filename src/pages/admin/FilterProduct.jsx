import React, { useState } from "react";

export default function FilterProduct({ onClear, onApply }) {
  const [filters, setFilters] = useState({
    priceMin: "",
    priceMax: "",
    inStock: false,
    status: "",
    category: "",
    weight: "",
    dateFrom: "",
    dateTo: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleClear = () => {
    const cleared = {
      priceMin: "",
      priceMax: "",
      inStock: false,
      status: "",
      category: "",
      weight: "",
      dateFrom: "",
      dateTo: "",
    };
    setFilters(cleared);
    onClear?.(); // parent ko notify
  };

  const handleApply = () => {
    onApply?.(filters); // parent ko filters bhej raha
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-sm space-y-4">
      <h2 className="text-lg font-semibold text-[#7c1d1d]">Filters</h2>

      {/* ✅ Price Range */}
      <div className="flex gap-2">
        <input
          type="number"
          name="priceMin"
          value={filters.priceMin}
          onChange={handleChange}
          placeholder="Min Price"
          className="w-1/2 p-2 border rounded"
        />
        <input
          type="number"
          name="priceMax"
          value={filters.priceMax}
          onChange={handleChange}
          placeholder="Max Price"
          className="w-1/2 p-2 border rounded"
        />
      </div>

      {/* ✅ Stock */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="inStock"
          checked={filters.inStock}
          onChange={handleChange}
        />
        <span>In Stock</span>
      </label>

      {/* ✅ Status */}
      <select
        name="status"
        value={filters.status}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="">Select Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      {/* ✅ Category */}
      <input
        type="text"
        name="category"
        value={filters.category}
        onChange={handleChange}
        placeholder="Category"
        className="w-full p-2 border rounded"
      />

      {/* ✅ Weight */}
      <select
        name="weight"
        value={filters.weight}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="">Select Weight</option>
        <option value="light">Light</option>
        <option value="medium">Medium</option>
        <option value="heavy">Heavy</option>
      </select>

      {/* ✅ Date Range */}
      <div className="flex gap-2">
        <input
          type="date"
          name="dateFrom"
          value={filters.dateFrom}
          onChange={handleChange}
          className="w-1/2 p-2 border rounded"
        />
        <input
          type="date"
          name="dateTo"
          value={filters.dateTo}
          onChange={handleChange}
          className="w-1/2 p-2 border rounded"
        />
      </div>

      {/* ✅ Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleApply}
          className="w-full bg-[#7c1d1d] text-white hover:bg-[#5e1616] py-2 rounded"
        >
          Apply Filters
        </button>
        <button
          onClick={handleClear}
          className="w-full bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 rounded"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
