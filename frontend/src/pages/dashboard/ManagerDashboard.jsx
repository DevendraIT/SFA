import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Target,
  MapPin,
  ShoppingCart,
  ClipboardCheck,
  Clock3,
  TrendingUp,
  UserCheck,
  IndianRupee,
  Activity,
  AlertTriangle,
  Plus,
  FileText,
  Calendar,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import dayjs from "dayjs";

import useManagerDashboard from "../../hooks/useManagerDashboard";
import { useAuth } from "../../context/AuthContext";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatsGrid from "../../components/dashboard/StatsGrid";
import StatCard from "../../components/dashboard/StatCard";
import SectionCard from "../../components/dashboard/SectionCard";
import ChartCard from "../../components/dashboard/ChartCard";
import PerformanceCard from "../../components/dashboard/PerformanceCard";
import AttendanceCard from "../../components/dashboard/AttendanceCard";
import ActivityTimeline from "../../components/dashboard/ActivityTimeline";
import QuickActions from "../../components/dashboard/QuickActions";
import RecentOrders from "../../components/dashboard/RecentOrders";
import RecentTasks from "../../components/dashboard/RecentTasks";
import EmptyDashboard from "../../components/dashboard/EmptyDashboard";
import ErrorState from "../../components/dashboard/ErrorState";
import { DashboardGridSkeleton } from "../../components/dashboard/LoadingSkeleton";

const quickActions = [
  {
    label: "Assign Task",
    icon: Plus,
    iconColor: "text-blue-600",
  },
  {
    label: "View Team",
    icon: Users,
    iconColor: "text-emerald-600",
    path: "/organization/teams",
  },
  {
    label: "Reports",
    icon: FileText,
    iconColor: "text-orange-500",
    path: "/reports",
  },
  {
    label: "Schedule",
    icon: Calendar,
    iconColor: "text-violet-600",
  },
];

export default function ManagerDashboard() {
  const { user } = useAuth();
  const { dashboard, loading, error, refresh } = useManagerDashboard();

  const fullName = useMemo(() => {
    if (!user) return "";
    return `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  }, [user]);

  if (loading) {
    return <DashboardGridSkeleton />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load dashboard"
        message="Unable to fetch manager dashboard data. Please try again."
        onRetry={refresh}
      />
    );
  }

  const hasData = dashboard && Object.keys(dashboard).length > 0;

  if (!hasData) {
    return (
      <EmptyDashboard
        title="No Dashboard Data"
        description="Manager dashboard data will appear once team activities are recorded."
        onAction={refresh}
      />
    );
  }

  const teamVisits = dashboard?.teamVisits || {};
  const teamTargets = dashboard?.teamTargets || [];
  const teamOrders = dashboard?.teamOrders || {};

  const completedVisits = teamVisits?.COMPLETED || 0;
  const pendingVisits = teamVisits?.PENDING || 0;
  const inProgressVisits = teamVisits?.IN_PROGRESS || 0;
  const totalVisits = completedVisits + pendingVisits + inProgressVisits;

  const approvedOrders = teamOrders?.APPROVED?.count || 0;
  const pendingOrders = teamOrders?.PENDING?.count || 0;
  const revenue = teamOrders?.APPROVED?.revenue || 0;
  const totalOrders = approvedOrders + pendingOrders;

  const performanceMetrics = teamTargets.slice(0, 3).map((t) => ({
    label: t.metric || "Target",
    value: t.targetValue > 0 ? Math.round((t.achievedValue / t.targetValue) * 100) : 0,
  }));

  if (performanceMetrics.length < 3) {
    const defaults = [
      { label: "Visit Completion", value: totalVisits > 0 ? Math.round((completedVisits / totalVisits) * 100) : 0 },
      { label: "Team Sales Target", value: 0 },
      { label: "Customer Meetings", value: 0 },
    ];
    for (let i = performanceMetrics.length; i < 3; i++) {
      performanceMetrics.push(defaults[i]);
    }
  }

  // Chart data for team performance
  const chartData = [
    { name: "Completed", visits: completedVisits },
    { name: "In Progress", visits: inProgressVisits },
    { name: "Pending", visits: pendingVisits },
  ];

  // Recent tasks
  const recentTasks = teamTargets.slice(0, 5).map((t) => ({
    id: t.id,
    title: t.metric || "Target",
    description: `${t.achievedValue || 0} / ${t.targetValue || 0} achieved`,
    status: t.achievedValue >= t.targetValue ? "COMPLETED" : "IN_PROGRESS",
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <DashboardHeader
        welcomeText={`Welcome back, ${fullName || "Manager"} 👋`}
        title="Sales Manager Dashboard"
        subtitle="Team performance and operations overview"
        onRefresh={refresh}
      />

      {/* Stats Grid */}
      <StatsGrid>
        <StatCard
          title="Team Visits"
          value={totalVisits}
          icon={MapPin}
          color="bg-blue-500"
        />
        <StatCard
          title="Completed"
          value={completedVisits}
          icon={ClipboardCheck}
          color="bg-emerald-500"
        />
        <StatCard
          title="Approved Orders"
          value={approvedOrders}
          icon={ShoppingCart}
          color="bg-cyan-500"
        />
        <StatCard
          title="Team Revenue"
          value={revenue}
          icon={IndianRupee}
          color="bg-green-600"
          format="currency"
        />
      </StatsGrid>

      {/* Charts & Performance */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Team Visit Chart */}
        <ChartCard
          title="Team Visit Status"
          subtitle="Today's visit distribution"
          className="xl:col-span-2"
          delay={0.2}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="visits" fill="#2563EB" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Team Performance */}
        <PerformanceCard
          title="Team Performance"
          subtitle="Key metrics overview"
          icon={TrendingUp}
          metrics={performanceMetrics}
        />
      </div>

      {/* Attendance & Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceCard
          present={24}
          absent={2}
          leave={1}
          rate={96}
          title="Team Attendance"
          subtitle="Today's team attendance"
        />

        <SectionCard
          title="Pending Approvals"
          subtitle="Items requiring your review"
          icon={AlertTriangle}
          iconColor="text-orange-500"
        >
          <div className="space-y-4">
            {[
              { label: `${pendingOrders} Orders Pending Approval`, count: pendingOrders },
              { label: "Expense Claims", count: 8 },
              { label: "Leave Requests", count: 3 },
              { label: "Visit Reports", count: 5 },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0"
              >
                <span className="font-medium text-slate-700 text-sm">{item.label}</span>
                <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition">
                  Review
                </button>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Tasks & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard
          title="Team Tasks"
          subtitle="Assigned targets and objectives"
          icon={Target}
          action={
            <span className="text-xs text-slate-500">{recentTasks.length} tasks</span>
          }
        >
          <RecentTasks tasks={recentTasks} emptyMessage="No tasks assigned to the team yet." />
        </SectionCard>

        <SectionCard title="Quick Actions" subtitle="Common management tasks">
          <QuickActions actions={quickActions} />
        </SectionCard>
      </div>

      {/* Recent Activity */}
      <SectionCard
        title="Recent Activity"
        subtitle="Latest team activities"
        icon={Activity}
        action={
          <button className="text-blue-600 text-sm font-semibold hover:underline">View All</button>
        }
      >
        <ActivityTimeline
          activities={[
            { title: "Team Dashboard Viewed", description: "Manager accessed team overview", time: dayjs().format("h:mm A"), completed: true },
            { title: "Visits Updated", description: `${completedVisits} visits completed today`, time: "Today" },
            { title: "Orders Processed", description: `${approvedOrders} orders approved`, time: dayjs().subtract(2, "hours").format("h:mm A") },
          ]}
        />
      </SectionCard>
    </motion.div>
  );
}

