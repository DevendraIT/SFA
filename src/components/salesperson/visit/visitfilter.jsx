import { FiSearch } from "react-icons/fi";

export default function VisitFilters() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">

      <div className="grid lg:grid-cols-5 gap-4">

        <div className="lg:col-span-2 relative">

          <FiSearch className="absolute left-4 top-4 text-gray-400" />

          <input
            placeholder="Search customer..."
            className="w-full border rounded-xl py-3 pl-11 pr-4"
          />

        </div>

        <select className="border rounded-xl px-4">
          <option>Status</option>
        </select>

        <select className="border rounded-xl px-4">
          <option>Route</option>
        </select>

        <select className="border rounded-xl px-4">
          <option>Date</option>
        </select>

      </div>

    </div>
  );
}