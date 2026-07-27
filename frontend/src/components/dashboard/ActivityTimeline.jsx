import { motion } from "framer-motion";
import { Activity, CheckCircle2 } from "lucide-react";

export default function ActivityTimeline({
  activities = [],
  emptyMessage = "No recent activities found.",
  viewAllLink,
}) {
  if (!activities.length) {
    return (
      <div className="py-10 text-center text-slate-500 text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id || index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-start justify-between border-b border-slate-100 last:border-0 pb-5 last:pb-0"
        >
          <div className="flex gap-4">
            <div className="h-11 w-11 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Activity size={20} className="text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 text-sm">
                {activity.title || activity.name || "Activity"}
              </h4>
              <p className="text-sm text-slate-500 mt-0.5">
                {activity.description || activity.message || ""}
              </p>
              {activity.time && (
                <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
              )}
            </div>
          </div>
          {activity.completed && (
            <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
          )}
        </motion.div>
      ))}
    </div>
  );
}

