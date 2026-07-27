import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { StickyNote, RefreshCw, Plus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import fieldForceApi from "../../api/fieldForce.api";
import PageHeader from "../../components/dashboard/PageHeader";
import SectionCard from "../../components/dashboard/SectionCard";
import MeetingNotesCard from "../../components/field-force/MeetingNotesCard";
import EmptyDashboard from "../../components/dashboard/EmptyDashboard";
import ErrorState from "../../components/dashboard/ErrorState";
import { TableSkeleton } from "../../components/dashboard/LoadingSkeleton";

export default function MeetingNotesPage() {
  const { user } = useAuth();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [noteText, setNoteText] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fieldForceApi.listVisits({ take: 100 });
      const data = res.data?.data || res.data;
      setVisits(data?.visits || data || []);
    } catch (err) {
      setError(err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (!selectedVisit || !noteText.trim()) {
      toast.error("Please select a visit and enter notes");
      return;
    }
    try {
      setSaving(true);
      await fieldForceApi.addVisitNotes(selectedVisit.id, { notes: noteText });
      toast.success("Notes saved successfully!");
      setShowForm(false);
      setSelectedVisit(null);
      setNoteText("");
      loadData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save notes");
    } finally {
      setSaving(false);
    }
  };

  const visitsWithNotes = visits.filter((v) => v.notes);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-slate-200 rounded animate-pulse" />
        <TableSkeleton rows={4} cols={3} />
      </div>
    );
  }

  if (error) {
    return <ErrorState message="Failed to load data" onRetry={loadData} />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Meeting Notes" subtitle="Add and manage visit notes">
        <button onClick={() => { setShowForm(!showForm); setSelectedVisit(null); setNoteText(""); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition">
          <Plus size={16} /> {showForm ? "Cancel" : "New Note"}
        </button>
      </PageHeader>

      {showForm && (
        <SectionCard title="Add Meeting Notes" icon={StickyNote} iconColor="text-amber-600">
          <form onSubmit={handleSaveNote} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Select Visit *</label>
              <select
                value={selectedVisit?.id || ""}
                onChange={(e) => {
                  const visit = visits.find((v) => v.id === e.target.value);
                  setSelectedVisit(visit || null);
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm"
                required
              >
                <option value="">Choose a visit...</option>
                {visits.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.title} - {v.scheduledAt ? new Date(v.scheduledAt).toLocaleDateString() : "N/A"}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Meeting Notes *</label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm"
                rows={6}
                placeholder="Enter detailed meeting notes, feedback, action items..."
                required
              />
            </div>
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition disabled:opacity-50">
              {saving ? "Saving..." : "Save Notes"}
            </button>
          </form>
        </SectionCard>
      )}

      <SectionCard title="Visit Notes" subtitle={`${visitsWithNotes.length} note(s)`} icon={StickyNote} iconColor="text-amber-600">
        {visitsWithNotes.length === 0 ? (
          <EmptyDashboard title="No Notes" description="No meeting notes recorded yet" onAction={loadData} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visitsWithNotes.map((visit, i) => (
              <MeetingNotesCard key={visit.id} note={{
                title: visit.title,
                notes: visit.notes,
                date: visit.scheduledAt || visit.createdAt,
                createdAt: visit.createdAt,
              }} index={i} />
            ))}
          </div>
        )}
      </SectionCard>
    </motion.div>
  );
}
