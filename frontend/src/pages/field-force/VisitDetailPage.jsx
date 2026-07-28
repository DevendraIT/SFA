import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { ClipboardCheck, MapPin, Clock, User, ArrowLeft, RefreshCw, Loader2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

import fieldForceApi from "../../api/fieldForce.api";
import PageHeader from "../../components/dashboard/PageHeader";
import SectionCard from "../../components/dashboard/SectionCard";
import StatusBadge from "../../components/field-force/StatusBadge";
import ErrorState from "../../components/dashboard/ErrorState";

export default function VisitDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadVisit = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fieldForceApi.getVisit(id);
      const data = res.data?.data || res.data;
      setVisit(data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVisit();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 space-y-4">
        <Loader2 size={40} className="animate-spin text-blue-600" />
        <p className="text-sm text-slate-500">Loading visit details...</p>
      </div>
    );
  }

  if (error || !visit) {
    return <ErrorState message="Failed to load visit details" onRetry={loadVisit} />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/field-force/visits")}
          className="h-10 w-10 rounded-xl border border-slate-300 flex items-center justify-center hover:bg-slate-50 transition"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{visit.title}</h1>
          <p className="text-xs text-slate-500">Customer Visit Record</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SectionCard title="Visit Details" icon={ClipboardCheck} iconColor="text-blue-600">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="text-sm font-semibold text-slate-700">Status</span>
                <StatusBadge status={visit.status} type="visit" size="lg" />
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="text-sm font-semibold text-slate-700">Scheduled Time</span>
                <span className="text-sm font-medium text-slate-800">
                  {visit.scheduledAt ? dayjs(visit.scheduledAt).format("DD MMM YYYY, h:mm A") : "N/A"}
                </span>
              </div>
              {visit.notes && (
                <div>
                  <span className="text-sm font-semibold text-slate-700 block mb-1">Notes</span>
                  <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">{visit.notes}</p>
                </div>
              )}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Customer Location" icon={MapPin} iconColor="text-red-500">
            {visit.customer ? (
              <div className="space-y-2">
                <p className="font-bold text-slate-900 text-sm">{visit.customer.name}</p>
                {visit.customer.address && <p className="text-xs text-slate-500">{typeof visit.customer.address === 'object' ? JSON.stringify(visit.customer.address) : visit.customer.address}</p>}
              </div>
            ) : (
              <p className="text-xs text-slate-500">Customer details available on task execution</p>
            )}
          </SectionCard>
        </div>
      </div>
    </motion.div>
  );
}
