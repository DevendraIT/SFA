import { motion } from "framer-motion";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

const statusIcons = {
  COMPLETED: CheckCircle2,
  PENDING: Clock,
  OVERDUE: AlertCircle,
  IN_PROGRESS: Clock,
};

const statusColors = {
  COMPLETED: "text-emerald-500",
  PENDING: "text-amber-500",
  OVERDUE: "text-red-500",
  IN_PROGRESS: "text-blue-500",
};

export default function RecentTasks({
  tasks = [],
  emptyMessage = "No tasks assigned.",
}) {
  if (!tasks.length) {
    return (
      <div className="py-10 text-center text-slate-500 text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task, index) => {
        const StatusIcon = statusIcons[task.status] || Clock;
        const statusColor = statusColors[task.status] || "text-slate-500";

        return (
          <motion.div
            key={task.id || index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition"
          >
            <StatusIcon size={20} className={`${statusColor} flex-shrink-0`} />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-800 text-sm truncate">
                {task.title || task.name || "Task"}
              </p>
              {task.description && (
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  {task.description}
                </p>
              )}
            </div>
            {task.dueDate && (
              <span className="text-xs text-slate-400 flex-shrink-0">
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

