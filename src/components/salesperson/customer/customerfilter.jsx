import { FiSearch, FiDownload } from "react-icons/fi";

export default function CustomerFilters() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">

      <div className="grid lg:grid-cols-6 gap-4">

        <div className="lg:col-span-2 relative">

          <FiSearch className="absolute left-4 top-4 text-gray-400"/>

          <input
            placeholder="Search customer..."
            className="w-full border rounded-xl py-3 pl-11 pr-4"
          />

        </div>

        <select className="border rounded-xl px-4">
          <option>State</option>
        </select>

        <select className="border rounded-xl px-4">
          <option>City</option>
        </select>

        <select className="border rounded-xl px-4">
          <option>Status</option>
        </select>

        <button className="bg-green-600 text-white rounded-xl flex justify-center items-center gap-2">

          <FiDownload/>

          Export

        </button>

      </div>

    </div>
  );
}