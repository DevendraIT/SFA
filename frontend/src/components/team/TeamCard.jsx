import { motion } from "framer-motion";
import { Users, MapPin, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function TeamCard({ team, loading = false }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm animate-pulse">
        <div className="space-y-4">
          <div className="h-5 w-3/4 bg-slate-200 rounded" />
          <div className="h-3 w-1/2 bg-slate-200 rounded" />
          <div className="h-3 w-2/3 bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <motion.div whileHover={{ y: -3 }} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all">
      <Link to="/organization/teams" className="block">
        <div className="flex items-start justify-between mb-4">
          <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <Users size={24} className="text-blue-600" />
          </div>
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
            {team._count?.users || team.users?.length || 0} members
          </span>
        </div>
        <h3 className="text-lg font-bold text-slate-900">{team.name}</h3>
        {team.description && (
          <p className="text-sm text-slate-500 mt-1 line-clamp-2">{team.description}</p>
        )}
        <div className="mt-4 space-y-2">
          {team.branch && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Building2 size={14} />
              <span>{team.branch.name}</span>
            </div>
          )}
          {team.territory && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <MapPin size={14} />
              <span>{team.territory.name}</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
