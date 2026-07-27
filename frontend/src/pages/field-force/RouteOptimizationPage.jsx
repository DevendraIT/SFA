import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { Navigation, MapPin, Clock, RefreshCw, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import fieldForceApi from "../../api/fieldForce.api";
import PageHeader from "../../components/dashboard/PageHeader";
import SectionCard from "../../components/dashboard/SectionCard";
import StatusBadge from "../../components/field-force/StatusBadge";
import GpsStatusCard from "../../components/field-force/GpsStatusCard";
import EmptyDashboard from "../../components/dashboard/EmptyDashboard";
import ErrorState from "../../components/dashboard/ErrorState";
import { TableSkeleton } from "../../components/dashboard/LoadingSkeleton";

export default function RouteOptimizationPage() {
  const { user } = useAuth();
  const [visits, setVisits] = useState([]);
  const [optimizedRoute, setOptimizedRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [error, setError] = useState(null);

  const loadVisits = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fieldForceApi.listVisits({ status: "PLANNED", take: 50 });
      const data = res.data?.data || res.data;
      setVisits(data?.visits || data || []);
    } catch (err) {
      setError(err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadVisits(); }, []);

  const handleOptimize = async () => {
    const plannedVisitIds = visits.filter((v) => v.status === "PLANNED").map((v) => v.id);
    if (plannedVisitIds.length === 0) {
      toast.error("No planned visits to optimize");
      return;
    }
    try {
      setOptimizing(true);
      const res = await fieldForceApi.optimizeRoute({ visitIds: plannedVisitIds });
      const data = res.data?.data || res.data;
      setOptimizedRoute(data);
      toast.success("Route optimized!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Route optimization failed");
    } finally {
      setOptimizing(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-slate-200 rounded animate-pulse" />
        <TableSkeleton rows={5} cols={3} />
      </div>
    );
  }

  if (error) {
    return <ErrorState message="Failed to load route data" onRetry={loadVisits} />;
  }

  const plannedVisits = visits.filter((v) => v.status === "PLANNED");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Route Optimization" subtitle="Optimize your daily travel route">
        <button onClick={loadVisits} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium hover:bg-slate-50 transition">
          <RefreshCw size={16} /> Refresh
        </button>
      </PageHeader>

      {/* Route Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SectionCard title="Route Summary" icon={Navigation} iconColor="text-emerald-600" className="lg:col-span-2">
          {optimizedRoute ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-xl bg-blue-50 p-4 text-center">
                  <p className="text-lg font-bold text-blue-600">{optimizedRoute.optimizedOrder?.length || 0}</p>
                  <p className="text-xs text-slate-500 mt-1">Stops</p>
                </div>
                <div className="rounded-xl bg-emerald-50 p-4 text-center">
                  <p className="text-lg font-bold text-emerald-600">{optimizedRoute.estimatedDistance || "N/A"}</p>
                  <p className="text-xs text-slate-500 mt-1">Distance</p>
                </div>
                <div className="rounded-xl bg-amber-50 p-4 text-center">
                  <p className="text-lg font-bold text-amber-600">{optimizedRoute.estimatedDuration || "N/A"}</p>
                  <p className="text-xs text-slate-500 mt-1">Duration</p>
                </div>
              </div>

              {/* Travel Order */}
              <div className="mt-4">
                <h4 className="font-semibold text-slate-800 mb-3">Optimized Travel Sequence</h4>
                <div className="space-y-2">
                  {optimizedRoute.optimizedOrder?.map((visitId, idx) => {
                    const visit = visits.find((v) => v.id === visitId);
                    return (
                      <div key={visitId} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                        <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm text-slate-800">{visit?.title || "Visit"}</p>
                          <p className="text-xs text-slate-500">{visit?.customer?.name || ""}</p>
                        </div>
                        <MapPin size={16} className="text-slate-400" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Navigation size={48} className="text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 mb-4">Optimize your planned visits to get the best travel route</p>
              <button
                onClick={handleOptimize}
                disabled={optimizing || plannedVisits.length === 0}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 transition disabled:opacity-50"
              >
                {optimizing ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
                {optimizing ? "Optimizing..." : `Optimize Route (${plannedVisits.length} visits)`}
              </button>
            </div>
          )}
        </SectionCard>

        <SectionCard title="Map Preview" icon={MapPin} iconColor="text-blue-600">
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <MapPin size={48} className="mb-3" />
            <p className="text-sm text-center">Route map visualization will appear here</p>
            <p className="text-xs text-center mt-1">Requires map service integration</p>
          </div>
        </SectionCard>
      </div>

      {/* Planned Visits for Route */}
      <SectionCard title="Planned Visits" subtitle={`${plannedVisits.length} visit(s) to be sequenced`} icon={MapPin} iconColor="text-blue-600">
        {plannedVisits.length === 0 ? (
          <EmptyDashboard title="No Planned Visits" description="Plan some visits to optimize your route" />
        ) : (
          <div className="space-y-3">
            {plannedVisits.map((visit, i) => (
              <div key={visit.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-600">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-slate-800">{visit.title}</p>
                    <p className="text-xs text-slate-400">
                      {visit.scheduledAt ? dayjs(visit.scheduledAt).format("MMM D, h:mm A") : "No schedule"}
                      {visit.notes && ` · ${visit.notes.substring(0, 30)}`}
                    </p>
                  </div>
                </div>
                <StatusBadge status={visit.status} type="visit" />
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </motion.div>
  );
}

