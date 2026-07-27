import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { Activity, RefreshCw, CheckCircle2, Clock, MapPin, FileText, AlertCircle, TrendingUp } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import fieldForceApi from "../../api/fieldForce.api";
import PageHeader from "../../components/dashboard/PageHeader";
import SectionCard from "../../components/dashboard/SectionCard";
import ActivityTimeline from "../../components/dashboard/ActivityTimeline";
import EmptyDashboard from "../../components/dashboard/EmptyDashboard";
import ErrorState from "../../components/dashboard/ErrorState";
import { TableSkeleton } from "../../components/dashboard/LoadingSkeleton";

export default function ActivitiesPage() {
  const { user } = useAuth();
  const [visits, setVisits] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("ALL");

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [visitsRes, tasksRes, expensesRes] = await Promise.allSettled([
        fieldForceApi.listVisits({ take: 50 }),
        fieldForceApi.listTasks({ take: 50 }),
        fieldForceApi.listExpenses({ take: 50 }),
      ]);

      if (visitsRes.status === "fulfilled") {
        const data = visitsRes.value.data?.data || visitsRes.value.data;
        setVisits(data?.visits || data || []);
      }
      if (tasksRes.status === "fulfilled") {
        const data = tasksRes.value.data?.data || tasksRes.value.data;
        setTasks(data?.tasks || data || []);
      }
      if (expensesRes.status === "fulfilled") {
        const data = expensesRes.value.data?.data || expensesRes.value.data;
        setExpenses(data?.expenses || data || []);
      }
    } catch (err) {
      setError(err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const allActivities = [
    ...visits.map((v) => ({
      id: `visit-${v.id}`,
      title: v.status === "COMPLETED" ? "Visit Completed" : v.status === "IN_PROGRESS" ? "Visit Started" : "Visit Planned",
      description: v.title,
      time: dayjs(v.scheduledAt || v.createdAt).format("MMM D, h:mm A"),
      completed: v.status === "COMPLETED",
      type: "visit",
      date: v.scheduledAt || v.createdAt,
    })),
    ...tasks.map((t) => ({
      id: `task-${t.id}`,
      title: t.status === "COMPLETED" ? "Task Completed" : `Task: ${t.title}`,
      description: t.status === "COMPLETED" ? `Completed: ${t.completionNotes || ""}` : t.description || "",
      time: dayjs(t.completedAt || t.createdAt).format("MMM D, h:mm A"),
      completed: t.status === "COMPLETED",
      type: "task",
      date: t.completedAt || t.createdAt,
    })),
    ...expenses.map((e) => ({
      id: `expense-${e.id}`,
      title: `Expense: ₹${e.amount?.toLocaleString("en-IN")}`,
      description: `${e.category} - ${e.status}`,
      time: dayjs(e.date || e.createdAt).format("MMM D, YYYY"),
      completed: e.status === "APPROVED",
      type: "expense",
      date: e.date || e.createdAt,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const filteredActivities = activeFilter === "ALL"
    ? allActivities
    : allActivities.filter((a) => a.type === activeFilter.toLowerCase());

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-slate-200 rounded animate-pulse" />
        <TableSkeleton rows={6} cols={2} />
      </div>
    );
  }

  if (error) {
    return <ErrorState message="Failed to load activities" onRetry={loadData} />;
  }

  const completedCount = allActivities.filter((a) => a.completed).length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Activities" subtitle="Track all your field activities">
        <button onClick={loadData} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium hover:bg-slate-50 transition">
          <RefreshCw size={16} /> Refresh
        </button>
      </PageHeader>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-slate-50 p-4 text-center">
          <p className="text-2xl font-bold text-slate-800">{allActivities.length}</p>
          <p className="text-xs text-slate-500 mt-1">Total Activities</p>
        </div>
        <div className="rounded-xl bg-emerald-50 p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{completedCount}</p>
          <p className="text-xs text-slate-500 mt-1">Completed</p>
        </div>
        <div className="rounded-xl bg-amber-50 p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{allActivities.length - completedCount}</p>
          <p className="text-xs text-slate-500 mt-1">Pending</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { label: "All", value: "ALL" },
          { label: "Visits", value: "visit" },
          { label: "Tasks", value: "task" },
          { label: "Expenses", value: "expense" },
        ].map((f) => (
          <button key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${
              activeFilter === f.value ? "bg-blue-600 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Activity Timeline */}
      <SectionCard title="Activity Timeline" subtitle={`${filteredActivities.length} activity(s)`} icon={Activity} iconColor="text-blue-600">
        {filteredActivities.length === 0 ? (
          <EmptyDashboard title="No Activities" description="No activities recorded yet" onAction={loadData} />
        ) : (
          <ActivityTimeline activities={filteredActivities} emptyMessage="No activities found" />
        )}
      </SectionCard>
    </motion.div>
  );
}
