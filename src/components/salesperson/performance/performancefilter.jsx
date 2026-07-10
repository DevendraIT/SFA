import { FiDownload } from "react-icons/fi";

export default function PerformanceFilters() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">

      <div className="grid lg:grid-cols-6 gap-4">

        <select className="border rounded-xl px-4 py-3">
          <option>This Month</option>
        </select>

        <select className="border rounded-xl px-4 py-3">
          <option>Salesperson</option>
        </select>

        <select className="border rounded-xl px-4 py-3">
          <option>Region</option>
        </select>

        <select className="border rounded-xl px-4 py-3">
          <option>Product</option>
        </select>

        <button className="bg-blue-600 text-white rounded-xl">
          Apply
        </button>

        <button className="bg-green-600 text-white rounded-xl flex justify-center items-center gap-2">
          <FiDownload />
          Export
        </button>

      </div>

    </div>
  );
}