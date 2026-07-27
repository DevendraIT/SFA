import { motion } from "framer-motion";
import { CheckCircle2, Clock, MapPin, TrendingUp } from "lucide-react";

export default function ExecutivePerformanceCard({ taskSummary, visitSummary, attendanceSummary, loading = false }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-pulse">
        <div className="space-y-4">
          <div className="h-5 w-40 bg-slate-200 rounded" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-20 bg-slate-200 rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  const metrics = [
    { label: "Completed Tasks", value: taskSummary?.completed || 0, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Pending Tasks", value: taskSummary?.pending || 0, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Total Visits", value: visitSummary?.total || 0, icon: MapPin, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Completed Visits", value: visitSummary?.completed || 0, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  const completionRate = taskSummary?.completionRate || 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div key={index} whileHover={{ y: -2 }} className={`rounded-xl ${metric.bg} p-4`}>
              <div className="flex items-center gap-2">
                <Icon size={18} className={metric.color} />
                <span className="text-xs text-slate-600 font-medium">{metric.label}</span>
              </div>
              <p className={`text-2xl font-bold mt-2 ${metric.color}`}>{metric.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-slate-700">Task Completion Rate</span>
          <span className="text-2xl font-bold text-slate-900">{completionRate}%</span>
        </div>
        <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ duration: 1 }}
            className={`h-full rounded-full ${completionRate >= 80 ? "bg-emerald-500" : completionRate >= 50 ? "bg-blue-500" : "bg-amber-500"}`}
          />
        </div>
      </div>

      {attendanceSummary && (
        <div className="flex gap-4 text-center">
          <div className="flex-1 rounded-xl bg-emerald-50 p-3">
            <p className="text-lg font-bold text-emerald-600">{attendanceSummary.present || 0}</p>
            <p className="text-xs text-slate-600">Present</p>
          </div>
          <div className="flex-1 rounded-xl bg-red-50 p-3">
            <p className="text-lg font-bold text-red-500">{attendanceSummary.absent || 0}</p>
            <p className="text-xs text-slate-600">Absent</p>
          </div>
          <div className="flex-1 rounded-xl bg-amber-50 p-3">
            <p className="text-lg font-bold text-amber-600">{attendanceSummary.leave || 0}</p>
            <p className="text-xs text-slate-600">Leave</p>
          </div>
        </div>
      )}
    </div>
  );
}
