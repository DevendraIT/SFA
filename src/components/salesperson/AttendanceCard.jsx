import { FiMapPin } from "react-icons/fi";

export default function AttendanceCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">

      <h2 className="text-xl font-bold mb-6">
        Attendance
      </h2>

      <div className="space-y-4">

        <div className="flex justify-between">
          <span>Check In</span>
          <span className="font-semibold">
            09:10 AM
          </span>
        </div>

        <div className="flex justify-between">
          <span>Current Status</span>
          <span className="text-green-600 font-semibold">
            Working
          </span>
        </div>

        <button className="w-full bg-blue-600 text-white rounded-xl py-3 flex items-center justify-center gap-2">
          <FiMapPin />
          Check Out
        </button>

      </div>

    </div>
  );
}