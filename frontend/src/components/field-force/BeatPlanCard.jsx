import { motion } from "framer-motion";
import { CalendarDays, Map } from "lucide-react";
import dayjs from "dayjs";
import StatusBadge from "./StatusBadge";

export default function BeatPlanCard({ plan, index = 0, onView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ y: -3 }}
      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer"
      onClick={() => onView?.(plan)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
            <Map size={20} className="text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">{plan.title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {plan.startDate ? dayjs(plan.startDate).format("MMM D") : "N/A"} - {plan.endDate ? dayjs(plan.endDate).format("MMM D, YYYY") : "N/A"}
            </p>
          </div>
        </div>
        <StatusBadge status={plan.status} type="beatPlan" />
      </div>

      <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <CalendarDays size={14} />
          <span>{dayjs(plan.createdAt).format("MMM D, YYYY")}</span>
        </div>
      </div>
    </motion.div>
  );
}

