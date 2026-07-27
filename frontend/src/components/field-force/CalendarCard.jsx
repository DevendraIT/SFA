import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";
import dayjs from "dayjs";

const eventTypeColors = {
  MEETING: { bg: "bg-blue-100", text: "text-blue-700", icon: "🤝" },
  CALL: { bg: "bg-emerald-100", text: "text-emerald-700", icon: "📞" },
  REMINDER: { bg: "bg-amber-100", text: "text-amber-700", icon: "⏰" },
  EVENT: { bg: "bg-purple-100", text: "text-purple-700", icon: "🎉" },
};

export default function CalendarCard({ event, index = 0, onClick }) {
  const typeStyle = eventTypeColors[event.type] || eventTypeColors.EVENT;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ y: -2 }}
      onClick={() => onClick?.(event)}
      className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div className={`h-10 w-10 rounded-xl ${typeStyle.bg} flex items-center justify-center text-xl flex-shrink-0`}>
          {typeStyle.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-slate-900 text-sm truncate">{event.title}</h4>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeStyle.bg} ${typeStyle.text}`}>
              {event.type}
            </span>
          </div>
          {event.description && (
            <p className="text-xs text-slate-500 mt-1 line-clamp-1">{event.description}</p>
          )}
          <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{dayjs(event.startTime).format("h:mm A")} - {dayjs(event.endTime).format("h:mm A")}</span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarIcon size={12} />
              <span>{dayjs(event.startTime).format("MMM D")}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

