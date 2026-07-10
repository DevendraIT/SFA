import { FiMapPin } from "react-icons/fi";

export default function CheckInCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">

      <div className="flex flex-col lg:flex-row justify-between lg:items-center">

        <div>

          <h2 className="text-xl font-bold">
            Attendance
          </h2>

          <p className="text-gray-500 mt-2">
            Start your field work for today
          </p>

        </div>

        <div className="flex gap-4 mt-5 lg:mt-0">

          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2">

            <FiMapPin />

            Check In

          </button>

          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl">

            Check Out

          </button>

        </div>

      </div>

    </div>
  );
}