import { motion } from "framer-motion";
import { FileText, Calendar, Eye } from "lucide-react";
import dayjs from "dayjs";
import StatusBadge from "./StatusBadge";

export default function DARCard({ dar, index = 0, onView, onAction }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ y: -3 }}
      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-violet-100 flex items-center justify-center">
            <FileText size={20} className="text-violet-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">DAR - {dar.date ? dayjs(dar.date).format("DD MMM YYYY") : "N/A"}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {dar.totalVisits || 0} visits · {dar.totalOrders || 0} orders
            </p>
          </div>
        </div>
        <StatusBadge status={dar.status} type="dar" />
      </div>

      {dar.summary && (
        <p className="text-sm text-slate-600 mt-2 line-clamp-2">{dar.summary}</p>
      )}

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Calendar size={12} />
          <span>{dayjs(dar.createdAt).format("MMM D, YYYY")}</span>
        </div>
        <div className="flex gap-2">
          {onView && (
            <button
              onClick={() => onView(dar)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-600 hover:bg-blue-50 transition"
            >
              <Eye size={14} /> View
            </button>
          )}
          {onAction && dar.status === "DRAFT" && (
            <button
              onClick={() => onAction(dar)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-600 hover:bg-emerald-50 transition"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

