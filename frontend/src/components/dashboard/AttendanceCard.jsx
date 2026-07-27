import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";

export default function AttendanceCard({
  present = 0,
  absent = 0,
  leave = 0,
  rate = 0,
  title = "Attendance Summary",
  subtitle = "Today's employee attendance",
}) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
        </div>
        <CalendarDays size={26} className="text-indigo-500" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-emerald-50 p-4">
          <h2 className="text-2xl font-bold text-emerald-600">{present}</h2>
          <p className="text-sm mt-1 text-slate-600 font-medium">Present</p>
        </div>
        <div className="rounded-xl bg-red-50 p-4">
          <h2 className="text-2xl font-bold text-red-500">{absent}</h2>
          <p className="text-sm mt-1 text-slate-600 font-medium">Absent</p>
        </div>
        <div className="rounded-xl bg-amber-50 p-4">
          <h2 className="text-2xl font-bold text-amber-600">{leave}</h2>
          <p className="text-sm mt-1 text-slate-600 font-medium">Leave</p>
        </div>
        <div className="rounded-xl bg-blue-50 p-4">
          <h2 className="text-2xl font-bold text-blue-600">{rate}%</h2>
          <p className="text-sm mt-1 text-slate-600 font-medium">Rate</p>
        </div>
      </div>
    </motion.div>
  );
}

