import { motion } from "framer-motion";
import { IndianRupee, Calendar, FileText } from "lucide-react";
import dayjs from "dayjs";
import StatusBadge from "./StatusBadge";

const categoryIcons = {
  TRAVEL: "🚗",
  MEALS: "🍽️",
  ACCOMMODATION: "🏨",
  OTHER: "📦",
};

export default function ExpenseCard({ expense, index = 0, onView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ y: -3 }}
      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer"
      onClick={() => onView?.(expense)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{categoryIcons[expense.category] || "📦"}</span>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm capitalize">{expense.category?.toLowerCase()}</h3>
            {expense.notes && (
              <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{expense.notes}</p>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-slate-900">₹{expense.amount?.toLocaleString("en-IN")}</p>
          <StatusBadge status={expense.status} type="expense" />
        </div>
      </div>

      <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Calendar size={14} />
          <span>{expense.date ? dayjs(expense.date).format("MMM D, YYYY") : "-"}</span>
        </div>
        {expense.receiptUrl && (
          <div className="flex items-center gap-1.5">
            <FileText size={14} />
            <span>Receipt</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

