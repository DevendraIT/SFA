import { motion } from "framer-motion";
import { StickyNote, Calendar, Clock } from "lucide-react";
import dayjs from "dayjs";

export default function MeetingNotesCard({ note, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
          <StickyNote size={20} className="text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 text-sm truncate">{note.title || "Meeting Note"}</h3>
          {note.notes && (
            <p className="text-sm text-slate-600 mt-1 line-clamp-3 whitespace-pre-wrap">{note.notes}</p>
          )}
          <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>{note.date ? dayjs(note.date).format("MMM D, YYYY") : dayjs(note.createdAt).format("MMM D, YYYY")}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>Created {dayjs(note.createdAt).format("h:mm A")}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

