import { motion } from "framer-motion";
import { MapPin, Navigation, Crosshair } from "lucide-react";

export default function GpsStatusCard({ latitude, longitude, address, loading = false }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-slate-200" />
          <div className="space-y-2">
            <div className="h-3 w-28 bg-slate-200 rounded" />
            <div className="h-3 w-20 bg-slate-200 rounded" />
          </div>
        </div>
        <div className="h-3 w-48 bg-slate-200 rounded" />
      </div>
    );
  }

  const hasLocation = latitude != null && longitude != null;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${hasLocation ? "bg-emerald-100" : "bg-slate-100"}`}>
            <Navigation size={20} className={hasLocation ? "text-emerald-600" : "text-slate-400"} />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 text-sm">GPS Location</h4>
            <p className={`text-xs font-medium ${hasLocation ? "text-emerald-600" : "text-slate-400"}`}>
              {hasLocation ? "Active" : "No Signal"}
            </p>
          </div>
        </div>
        {hasLocation && (
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Crosshair size={12} />
            Live
          </span>
        )}
      </div>

      {hasLocation ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin size={14} className="text-slate-400 flex-shrink-0" />
            <span className="truncate">{address || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-100">
            <div>
              <p className="text-xs text-slate-400">Latitude</p>
              <p className="text-sm font-medium text-slate-700">{latitude.toFixed(6)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Longitude</p>
              <p className="text-sm font-medium text-slate-700">{longitude.toFixed(6)}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center py-4">
          <p className="text-sm text-slate-400">Waiting for GPS signal...</p>
        </div>
      )}
    </motion.div>
  );
}

