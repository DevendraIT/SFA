import { motion } from "framer-motion";
import { LogIn, LogOut, Clock, MapPin } from "lucide-react";
import StatusBadge from "./StatusBadge";
import dayjs from "dayjs";

export default function CheckInCard({
  todayAttendance,
  onCheckIn,
  onCheckOut,
  checkingIn = false,
  checkingOut = false,
  location,
}) {
  const isCheckedIn = !!todayAttendance?.checkInAt && !todayAttendance?.checkOutAt;
  const isCheckedOut = !!todayAttendance?.checkOutAt;
  const isPresent = todayAttendance?.status === "PRESENT";

  const checkInTime = todayAttendance?.checkInAt ? dayjs(todayAttendance.checkInAt).format("h:mm A") : null;
  const checkOutTime = todayAttendance?.checkOutAt ? dayjs(todayAttendance.checkOutAt).format("h:mm A") : null;
  const duration = todayAttendance?.durationMins;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-slate-900">Attendance</h3>
        {todayAttendance && <StatusBadge status={todayAttendance.status} type="attendance" size="lg" />}
      </div>

      {/* Status Timeline */}
      <div className="space-y-4 mb-6">
        <div className={`flex items-center gap-4 p-4 rounded-xl ${isCheckedIn ? "bg-emerald-50" : "bg-slate-50"}`}>
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isCheckedIn ? "bg-emerald-600" : "bg-slate-300"}`}>
            <LogIn size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm text-slate-800">Check-In</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {checkInTime || "Not checked in yet"}
            </p>
          </div>
          {isCheckedIn && (
            <span className="text-xs font-semibold text-emerald-600">Completed</span>
          )}
        </div>

        <div className={`flex items-center gap-4 p-4 rounded-xl ${isCheckedOut ? "bg-slate-100" : "bg-slate-50"}`}>
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isCheckedOut ? "bg-slate-600" : "bg-slate-300"}`}>
            <LogOut size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm text-slate-800">Check-Out</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {checkOutTime || "Not checked out yet"}
            </p>
          </div>
          {isCheckedOut && (
            <span className="text-xs font-semibold text-slate-600">Completed</span>
          )}
        </div>
      </div>

      {/* Duration */}
      {duration != null && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 mb-5">
          <Clock size={18} className="text-blue-600" />
          <span className="text-sm font-medium text-blue-700">
            Working Duration: {Math.floor(duration / 60)}h {duration % 60}m
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {!isCheckedIn && !isCheckedOut && (
          <button
            onClick={onCheckIn}
            disabled={checkingIn || !location}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {checkingIn ? (
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <LogIn size={16} />
            )}
            {checkingIn ? "Checking In..." : "Check In"}
          </button>
        )}

        {isCheckedIn && !isCheckedOut && (
          <button
            onClick={onCheckOut}
            disabled={checkingOut || !location}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 text-white font-medium text-sm hover:bg-slate-900 transition disabled:opacity-50"
          >
            {checkingOut ? (
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <LogOut size={16} />
            )}
            {checkingOut ? "Checking Out..." : "Check Out"}
          </button>
        )}
      </div>

      {!location && (
        <p className="flex items-center gap-1 mt-3 text-xs text-amber-600">
          <MapPin size={12} />
          GPS location required to check in/out
        </p>
      )}
    </motion.div>
  );
}

