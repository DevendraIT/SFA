import { motion } from "framer-motion";
import { MapPin, Clock, User, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import StatusBadge from "./StatusBadge";

export default function VisitCard({ visit, index = 0 }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ y: -3 }}
      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer"
      onClick={() => navigate(`/field-force/visits/${visit.id}`)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 text-sm truncate">{visit.title}</h3>
          {visit.notes && (
            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{visit.notes}</p>
          )}
        </div>
        <ChevronRight size={18} className="text-slate-400 flex-shrink-0 mt-1" />
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-3">
        <StatusBadge status={visit.status} type="visit" />
        {visit.type && (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
            {visit.type.replace(/_/g, " ")}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-slate-500">
        {visit.scheduledAt && (
          <div className="flex items-center gap-1.5">
            <Clock size={14} />
            <span>{dayjs(visit.scheduledAt).format("MMM D, YYYY h:mm A")}</span>
          </div>
        )}
        {visit.customer?.name && (
          <div className="flex items-center gap-1.5">
            <User size={14} />
            <span>{visit.customer.name}</span>
          </div>
        )}
        {visit.location && (
          <div className="flex items-center gap-1.5">
            <MapPin size={14} />
            <span>Geo-tagged</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

