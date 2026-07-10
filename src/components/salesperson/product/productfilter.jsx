import { FiSearch, FiFilter } from "react-icons/fi";

export default function ProductFilters() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">

      <div className="grid lg:grid-cols-6 gap-4">

        <div className="lg:col-span-2 relative">

          <FiSearch className="absolute left-4 top-4 text-gray-400" />

          <input
            className="w-full border rounded-xl py-3 pl-11"
            placeholder="Search Product..."
          />

        </div>

        <select className="border rounded-xl px-4">
          <option>Category</option>
        </select>

        <select className="border rounded-xl px-4">
          <option>Brand</option>
        </select>

        <select className="border rounded-xl px-4">
          <option>Stock</option>
        </select>

        <button className="bg-blue-600 text-white rounded-xl flex justify-center items-center gap-2">

          <FiFilter />

          Filter

        </button>

      </div>

    </div>
  );
}