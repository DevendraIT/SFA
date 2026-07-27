import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import {
  User, Mail, Phone, Building2, MapPin, Target,
  RefreshCw, CalendarDays, Activity, Award,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import useFieldForce from "../../hooks/useFieldForce";
import userApi from "../../api/user.api";
import PageHeader from "../../components/dashboard/PageHeader";
import SectionCard from "../../components/dashboard/SectionCard";
import PerformanceCard from "../../components/dashboard/PerformanceCard";
import StatusBadge from "../../components/field-force/StatusBadge";
import ErrorState from "../../components/dashboard/ErrorState";
import { TableSkeleton } from "../../components/dashboard/LoadingSkeleton";

export default function ProfilePage() {
  const { user } = useAuth();
  const fullName = useMemo(() => {
    if (!user) return "";
    return `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  }, [user]);

  const [managerName, setManagerName] = useState("");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    tasks, visits, attendanceHistory, loading: ffLoading,
    error, refresh, visitSummary, taskSummary,
  } = useFieldForce(user?.id);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const res = await userApi.getUser(user.id);
        const data = res.data?.data || res.data;
        setProfile(data);
        if (data.manager) {
          setManagerName(`${data.manager.firstName || ""} ${data.manager.lastName || ""}`.trim());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [user?.id]);

  if (loading || ffLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-slate-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TableSkeleton rows={4} cols={2} />
          </div>
          <TableSkeleton rows={4} cols={2} />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message="Failed to load profile data" onRetry={refresh} />;
  }

  const performanceMetrics = [
    { label: "Visit Completion", value: visitSummary.total > 0 ? Math.round((visitSummary.completed / visitSummary.total) * 100) : 0 },
    { label: "Task Completion", value: taskSummary.completionRate },
    { label: "Attendance Rate", value: attendanceHistory.length > 0 ? Math.round((attendanceHistory.filter((a) => a.status === "PRESENT").length / attendanceHistory.length) * 100) : 0 },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="My Profile" subtitle="Your executive details and performance summary">
        <button onClick={refresh} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium hover:bg-slate-50 transition">
          <RefreshCw size={16} /> Refresh
        </button>
      </PageHeader>

      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-3xl flex-shrink-0">
            {fullName.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900">{fullName}</h1>
            <p className="text-sm text-slate-500 mt-1">Sales Executive</p>
            <div className="flex flex-wrap gap-4 mt-3">
              {user?.email && (
                <span className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Mail size={14} /> {user.email}
                </span>
              )}
              {profile?.phoneNumber && (
                <span className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Phone size={14} /> {profile.phoneNumber}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <StatusBadge status="PRESENT" type="attendance" size="lg" />
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SectionCard title="Executive Details" icon={User} iconColor="text-blue-600">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Branch", value: profile?.branch?.name || "N/A", icon: Building2 },
                { label: "Department", value: profile?.department?.name || "N/A", icon: Building2 },
                { label: "Team", value: profile?.team?.name || "N/A", icon: Users },
                { label: "Territory", value: profile?.territory?.name || "N/A", icon: MapPin },
                { label: "Reporting Manager", value: managerName || "N/A", icon: User },
                { label: "Joined", value: profile?.createdAt ? dayjs(profile.createdAt).format("DD MMM YYYY") : "N/A", icon: CalendarDays },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-slate-50">
                    <Icon size={18} className="text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">{item.label}</p>
                      <p className="font-medium text-sm text-slate-800">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>

        <PerformanceCard
          title="Performance Summary"
          subtitle="Current period metrics"
          icon={Target}
          metrics={performanceMetrics}
        />
      </div>

      {/* Attendance Summary */}
      <SectionCard title="Attendance Summary" icon={CalendarDays} iconColor="text-indigo-600">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-xl bg-slate-50 p-5 text-center">
            <p className="text-2xl font-bold text-slate-800">{attendanceHistory.length}</p>
            <p className="text-xs text-slate-500 mt-1">Total Days</p>
          </div>
          <div className="rounded-xl bg-emerald-50 p-5 text-center">
            <p className="text-2xl font-bold text-emerald-600">{attendanceHistory.filter((a) => a.status === "PRESENT").length}</p>
            <p className="text-xs text-slate-500 mt-1">Present</p>
          </div>
          <div className="rounded-xl bg-red-50 p-5 text-center">
            <p className="text-2xl font-bold text-red-500">{attendanceHistory.filter((a) => a.status === "ABSENT").length}</p>
            <p className="text-xs text-slate-500 mt-1">Absent</p>
          </div>
          <div className="rounded-xl bg-amber-50 p-5 text-center">
            <p className="text-2xl font-bold text-amber-600">{attendanceHistory.filter((a) => a.status === "LEAVE").length}</p>
            <p className="text-xs text-slate-500 mt-1">Leave</p>
          </div>
        </div>
      </SectionCard>

      {/* Performance Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <SectionCard title="Visits" icon={Activity} iconColor="text-blue-600">
          <div className="space-y-3">
            <div className="flex justify-between text-sm"><span className="text-slate-500">Total</span><span className="font-bold">{visitSummary.total}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Completed</span><span className="font-bold text-emerald-600">{visitSummary.completed}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Planned</span><span className="font-bold text-blue-600">{visitSummary.planned}</span></div>
          </div>
        </SectionCard>
        <SectionCard title="Tasks" icon={Target} iconColor="text-emerald-600">
          <div className="space-y-3">
            <div className="flex justify-between text-sm"><span className="text-slate-500">Total</span><span className="font-bold">{taskSummary.total}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Completed</span><span className="font-bold text-emerald-600">{taskSummary.completed}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Completion Rate</span><span className="font-bold text-blue-600">{taskSummary.completionRate}%</span></div>
          </div>
        </SectionCard>
        <SectionCard title="Achievements" icon={Award} iconColor="text-amber-600">
          <div className="space-y-3">
            <div className="flex justify-between text-sm"><span className="text-slate-500">Assigned Territory</span><span className="font-bold">{profile?.territory?.name || "N/A"}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Team</span><span className="font-bold">{profile?.team?.name || "N/A"}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Manager</span><span className="font-bold">{managerName || "N/A"}</span></div>
          </div>
        </SectionCard>
      </div>
    </motion.div>
  );
}

