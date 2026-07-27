import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { Map, RefreshCw, Loader2, CalendarDays } from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import fieldForceApi from "../../api/fieldForce.api";
import PageHeader from "../../components/dashboard/PageHeader";
import SectionCard from "../../components/dashboard/SectionCard";
import BeatPlanCard from "../../components/field-force/BeatPlanCard";
import StatusBadge from "../../components/field-force/StatusBadge";
import EmptyDashboard from "../../components/dashboard/EmptyDashboard";
import ErrorState from "../../components/dashboard/ErrorState";
import { TableSkeleton } from "../../components/dashboard/LoadingSkeleton";

export default function BeatPlanningPage() {
  const { user } = useAuth();
  const [beatPlans, setBeatPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("ALL");

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fieldForceApi.listBeatPlans({ take: 100 });
      const data = res.data?.data || res.data;
      setBeatPlans(data?.plans || data || []);
    } catch (err) {
      setError(err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const filteredPlans = activeFilter === "ALL"
    ? beatPlans
    : beatPlans.filter((p) => p.status === activeFilter);

  const todayPlans = beatPlans.filter((p) => {
    const today = dayjs().format("YYYY-MM-DD");
    return dayjs(p.startDate).format("YYYY-MM-DD") <= today && dayjs(p.endDate).format("YYYY-MM-DD") >= today;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-slate-200 rounded animate-pulse" />
        <TableSkeleton rows={4} cols={3} />
      </div>
    );
  }

  if (error) {
    return <ErrorState message="Failed to load beat plans" onRetry={loadData} />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Beat Planning" subtitle="Manage your assigned routes and plans">
        <button onClick={loadData} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium hover:bg-slate-50 transition">
          <RefreshCw size={16} /> Refresh
        </button>
      </PageHeader>

      {/* Today's Active Beat */}
      {todayPlans.length > 0 && (
        <SectionCard title="Today's Active Beat" icon={Map} iconColor="text-emerald-600" subtitle="Currently active plan">
          <div className="space-y-3">
            {todayPlans.map((plan, i) => (
              <BeatPlanCard key={plan.id} plan={plan} index={i} />
            ))}
          </div>
        </SectionCard>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {["ALL", "DRAFT", "APPROVED"].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${
              activeFilter === filter
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {filter === "ALL" ? "All Plans" : filter.charAt(0) + filter.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Beat Plans List */}
      <SectionCard title="Beat Plans" subtitle={`${filteredPlans.length} plan(s)`} icon={CalendarDays} iconColor="text-indigo-600">
        {filteredPlans.length === 0 ? (
          <EmptyDashboard title="No Beat Plans" description="No beat plans found" onAction={loadData} />
        ) : (
          <div className="space-y-3">
            {filteredPlans.map((plan, i) => (
              <BeatPlanCard key={plan.id} plan={plan} index={i} />
            ))}
          </div>
        )}
      </SectionCard>

      {/* Weekly Overview */}
      <SectionCard title="Weekly Overview" icon={CalendarDays} iconColor="text-blue-600">
        {beatPlans.length === 0 ? (
          <EmptyDashboard title="No Plans" description="No beat plans created yet" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl bg-blue-50 p-5 text-center">
              <p className="text-3xl font-bold text-blue-600">{beatPlans.length}</p>
              <p className="text-sm text-slate-600 mt-1">Total Plans</p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-5 text-center">
              <p className="text-3xl font-bold text-emerald-600">{beatPlans.filter((p) => p.status === "APPROVED").length}</p>
              <p className="text-sm text-slate-600 mt-1">Approved</p>
            </div>
            <div className="rounded-xl bg-amber-50 p-5 text-center">
              <p className="text-3xl font-bold text-amber-600">{beatPlans.filter((p) => p.status === "DRAFT").length}</p>
              <p className="text-sm text-slate-600 mt-1">Draft</p>
            </div>
          </div>
        )}
      </SectionCard>
    </motion.div>
  );
}

