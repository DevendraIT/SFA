import { FiSearch, FiDownload } from "react-icons/fi";

export default function OrderFilters() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">

      <div className="grid lg:grid-cols-6 gap-4">

        <div className="lg:col-span-2">

          <div className="relative">

            <FiSearch className="absolute left-4 top-4 text-gray-400"/>

            <input
              placeholder="Search Order..."
              className="w-full border rounded-xl py-3 pl-11"
            />

          </div>

        </div>

        <select className="border rounded-xl px-4">
          <option>Status</option>
        </select>

        <select className="border rounded-xl px-4">
          <option>Customer</option>
        </select>

        <select className="border rounded-xl px-4">
          <option>Date</option>
        </select>

        <button className="bg-green-600 text-white rounded-xl flex justify-center items-center gap-2">

          <FiDownload/>

          Export

        </button>

      </div>

    </div>
  );
}