import { motion } from "framer-motion";
import { Clock, CheckCircle2, PlayCircle, XCircle } from "lucide-react";

const statusIcons = {
  PENDING: Clock,
  IN_PROGRESS: PlayCircle,
  COMPLETED: CheckCircle2,
  CANCELLED: XCircle,
};

const statusColors = {
  PENDING: "text-amber-500",
  IN_PROGRESS: "text-blue-500",
  COMPLETED: "text-emerald-500",
  CANCELLED: "text-red-500",
};

const statusBgColors = {
  PENDING: "bg-amber-100",
  IN_PROGRESS: "bg-blue-100",
  COMPLETED: "bg-emerald-100",
  CANCELLED: "bg-red-100",
};

export default function TaskTimeline({ events = [] }) {
  if (!events.length) {
    return (
      <div className="py-8 text-center text-slate-500 text-sm">
        No timeline events yet.
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200" />

      <div className="space-y-6">
        {events.map((event, index) => {
          const StatusIcon = statusIcons[event.status] || Clock;
          const color = statusColors[event.status] || "text-slate-500";
          const bgColor = statusBgColors[event.status] || "bg-slate-100";

          return (
            <motion.div
              key={event.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className="relative flex items-start gap-5 pl-12"
            >
              {/* Icon */}
              <div
                className={`absolute left-3 -translate-x-1/2 h-10 w-10 rounded-full ${bgColor} flex items-center justify-center z-10`}
              >
                <StatusIcon size={18} className={color} />
              </div>

              {/* Content */}
              <div className="flex-1 bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-slate-800 text-sm">
                    {event.title || event.status || "Update"}
                  </h4>
                  {event.time && (
                    <span className="text-xs text-slate-400">{event.time}</span>
                  )}
                </div>
                {event.description && (
                  <p className="text-sm text-slate-500">{event.description}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

