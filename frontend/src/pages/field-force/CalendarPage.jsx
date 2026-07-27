import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { Calendar as CalendarIcon, RefreshCw, ChevronLeft, ChevronRight, Loader2, Plus } from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import fieldForceApi from "../../api/fieldForce.api";
import PageHeader from "../../components/dashboard/PageHeader";
import SectionCard from "../../components/dashboard/SectionCard";
import CalendarCard from "../../components/field-force/CalendarCard";
import EmptyDashboard from "../../components/dashboard/EmptyDashboard";
import ErrorState from "../../components/dashboard/ErrorState";
import { TableSkeleton } from "../../components/dashboard/LoadingSkeleton";

const VIEW_TYPES = ["Day", "Week", "Month"];

export default function CalendarPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState("Month");
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: dayjs().add(1, "hour").format("YYYY-MM-DDTHH:mm"),
    endTime: dayjs().add(2, "hours").format("YYYY-MM-DDTHH:mm"),
    type: "MEETING",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const startOfMonth = currentDate.startOf("month").format("YYYY-MM-DD");
      const endOfMonth = currentDate.endOf("month").format("YYYY-MM-DD");
      const res = await fieldForceApi.listCalendarEvents({
        startDate: startOfMonth,
        endDate: endOfMonth,
        take: 100,
      });
      const data = res.data?.data || res.data;
      setEvents(data?.events || data || []);
    } catch (err) {
      setError(err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [currentDate]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await fieldForceApi.createCalendarEvent({
        ...formData,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
      });
      toast.success("Event created!");
      setShowCreateForm(false);
      setFormData({
        title: "", description: "",
        startTime: dayjs().add(1, "hour").format("YYYY-MM-DDTHH:mm"),
        endTime: dayjs().add(2, "hours").format("YYYY-MM-DDTHH:mm"),
        type: "MEETING",
      });
      loadData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create event");
    } finally {
      setSaving(false);
    }
  };

  const navigateDate = (direction) => {
    if (currentView === "Day") setCurrentDate(currentDate.add(direction, "day"));
    else if (currentView === "Week") setCurrentDate(currentDate.add(direction, "week"));
    else setCurrentDate(currentDate.add(direction, "month"));
  };

  const getDateRange = () => {
    if (currentView === "Day") return currentDate.format("DD MMM YYYY");
    if (currentView === "Week") {
      const start = currentDate.startOf("week").format("DD MMM");
      const end = currentDate.endOf("week").format("DD MMM YYYY");
      return `${start} - ${end}`;
    }
    return currentDate.format("MMMM YYYY");
  };

  const filteredEvents = events.filter((e) => {
    const eventDate = dayjs(e.startTime);
    if (currentView === "Day") return eventDate.format("YYYY-MM-DD") === currentDate.format("YYYY-MM-DD");
    if (currentView === "Week") return eventDate.isSame(currentDate, "week");
    return eventDate.isSame(currentDate, "month");
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
    return <ErrorState message="Failed to load calendar events" onRetry={loadData} />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Calendar" subtitle="Manage your schedule">
        <div className="flex gap-3">
          <button onClick={() => setShowCreateForm(!showCreateForm)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition">
            {showCreateForm ? "Cancel" : "New Event"}
          </button>
          <button onClick={loadData} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium hover:bg-slate-50 transition">
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </PageHeader>

      {/* View Controls */}
      <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigateDate(-1)} className="p-2 rounded-xl hover:bg-slate-100 transition">
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <h2 className="text-lg font-bold text-slate-900 min-w-[180px] text-center">{getDateRange()}</h2>
          <button onClick={() => navigateDate(1)} className="p-2 rounded-xl hover:bg-slate-100 transition">
            <ChevronRight size={20} className="text-slate-600" />
          </button>
        </div>
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          {VIEW_TYPES.map((view) => (
            <button key={view}
              onClick={() => setCurrentView(view)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                currentView === view ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      {/* Create Event Form */}
      {showCreateForm && (
        <SectionCard title="Create Event" icon={CalendarIcon} iconColor="text-purple-600">
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
              <input type="text" required value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Event title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="MEETING">Meeting</option>
                <option value="CALL">Call</option>
                <option value="REMINDER">Reminder</option>
                <option value="EVENT">Event</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Start *</label>
                <input type="datetime-local" required value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">End *</label>
                <input type="datetime-local" required value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm"
                rows={3} placeholder="Optional description"
              />
            </div>
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition disabled:opacity-50">
              {saving ? "Creating..." : "Create Event"}
            </button>
          </form>
        </SectionCard>
      )}

      {/* Events List */}
      <SectionCard title="Events" subtitle={`${filteredEvents.length} event(s)`} icon={CalendarIcon} iconColor="text-purple-600">
        {filteredEvents.length === 0 ? (
          <EmptyDashboard title="No Events" description={`No events for ${getDateRange()}`} onAction={() => setShowCreateForm(true)} />
        ) : (
          <div className="space-y-3">
            {filteredEvents.map((event, i) => (
              <CalendarCard key={event.id} event={event} index={i} />
            ))}
          </div>
        )}
      </SectionCard>
    </motion.div>
  );
}
