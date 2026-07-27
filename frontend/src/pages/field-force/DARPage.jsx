import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { FileText, RefreshCw, Loader2, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import fieldForceApi from "../../api/fieldForce.api";
import PageHeader from "../../components/dashboard/PageHeader";
import SectionCard from "../../components/dashboard/SectionCard";
import DARCard from "../../components/field-force/DARCard";
import StatusBadge from "../../components/field-force/StatusBadge";
import EmptyDashboard from "../../components/dashboard/EmptyDashboard";
import ErrorState from "../../components/dashboard/ErrorState";
import { TableSkeleton } from "../../components/dashboard/LoadingSkeleton";

const DAR_FILTERS = ["ALL", "DRAFT", "SUBMITTED", "APPROVED"];

export default function DARPage() {
  const { user } = useAuth();
  const [dars, setDars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ summary: "" });
  const [selectedDar, setSelectedDar] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fieldForceApi.listDars({ take: 100 });
      const data = res.data?.data || res.data;
      setDars(data?.dars || data || []);
    } catch (err) {
      setError(err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      const res = await fieldForceApi.generateDar({ summary: formData.summary || undefined });
      toast.success("DAR generated successfully!");
      setShowCreateForm(false);
      setFormData({ summary: "" });
      loadData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to generate DAR");
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (dar) => {
    try {
      setSubmitting(dar.id);
      await fieldForceApi.submitDar(dar.id);
      toast.success("DAR submitted!");
      loadData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit DAR");
    } finally {
      setSubmitting(null);
    }
  };

  const filteredDars = activeFilter === "ALL"
    ? dars
    : dars.filter((d) => d.status === activeFilter);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-slate-200 rounded animate-pulse" />
        <TableSkeleton rows={4} cols={3} />
      </div>
    );
  }

  if (error) {
    return <ErrorState message="Failed to load DARs" onRetry={loadData} />;
  }

  const todayDar = dars.find((d) => dayjs(d.date).format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD"));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Daily Activity Report (DAR)" subtitle="Generate and submit your daily reports">
        <div className="flex gap-3">
          <button onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition">
            <FileText size={16} /> {showCreateForm ? "Cancel" : todayDar ? "Update Today's DAR" : "Generate DAR"}
          </button>
          <button onClick={loadData} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium hover:bg-slate-50 transition">
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </PageHeader>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl bg-slate-50 p-4 text-center">
          <p className="text-2xl font-bold text-slate-800">{dars.length}</p>
          <p className="text-xs text-slate-500 mt-1">Total</p>
        </div>
        <div className="rounded-xl bg-amber-50 p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{dars.filter((d) => d.status === "DRAFT").length}</p>
          <p className="text-xs text-slate-500 mt-1">Draft</p>
        </div>
        <div className="rounded-xl bg-blue-50 p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{dars.filter((d) => d.status === "SUBMITTED").length}</p>
          <p className="text-xs text-slate-500 mt-1">Submitted</p>
        </div>
        <div className="rounded-xl bg-emerald-50 p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{dars.filter((d) => d.status === "APPROVED").length}</p>
          <p className="text-xs text-slate-500 mt-1">Approved</p>
        </div>
      </div>

      {/* Today's DAR Status */}
      {todayDar && (
        <SectionCard title="Today's DAR" icon={FileText} iconColor="text-violet-600">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <StatusBadge status={todayDar.status} type="dar" size="lg" />
                <span className="text-sm text-slate-500">{todayDar.totalVisits || 0} visits · {todayDar.totalOrders || 0} orders</span>
              </div>
              {todayDar.summary && <p className="text-sm text-slate-600">{todayDar.summary}</p>}
            </div>
            {todayDar.status === "DRAFT" && (
              <button onClick={() => handleSubmit(todayDar)} disabled={submitting === todayDar.id}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 transition disabled:opacity-50">
                {submitting === todayDar.id ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
                Submit
              </button>
            )}
          </div>
        </SectionCard>
      )}

      {/* Create/Update DAR Form */}
      {showCreateForm && (
        <SectionCard title={todayDar ? "Update DAR" : "Generate New DAR"} icon={FileText} iconColor="text-violet-600">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Summary</label>
              <textarea value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm"
                rows={5}
                placeholder="Describe your day's activities, achievements, challenges..."
              />
            </div>
            <button onClick={handleGenerate} disabled={generating}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition disabled:opacity-50">
              {generating ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
              {generating ? "Generating..." : todayDar ? "Update DAR" : "Generate DAR"}
            </button>
          </div>
        </SectionCard>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {DAR_FILTERS.map((filter) => (
          <button key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${
              activeFilter === filter ? "bg-blue-600 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {filter === "ALL" ? "All" : filter.charAt(0) + filter.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* DAR List */}
      <SectionCard title="DAR History" subtitle={`${filteredDars.length} report(s)`} icon={FileText} iconColor="text-violet-600">
        {filteredDars.length === 0 ? (
          <EmptyDashboard title="No DARs" description="No daily activity reports found" onAction={() => setShowCreateForm(true)} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDars.map((dar, i) => (
              <DARCard
                key={dar.id}
                dar={dar}
                index={i}
                onView={(d) => setSelectedDar(d)}
                onAction={(d) => handleSubmit(d)}
              />
            ))}
          </div>
        )}
      </SectionCard>
    </motion.div>
  );
}
