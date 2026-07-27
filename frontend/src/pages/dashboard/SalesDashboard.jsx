import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  ClipboardCheck,
  Clock3,
  ShoppingCart,
  IndianRupee,
  TrendingUp,
  Target,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  UserCheck,
  Activity,
} from "lucide-react";
import dayjs from "dayjs";

import useDashboard from "../../hooks/useDashboard";
import { useAuth } from "../../context/AuthContext";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatsGrid from "../../components/dashboard/StatsGrid";
import StatCard from "../../components/dashboard/StatCard";
import SectionCard from "../../components/dashboard/SectionCard";
import PerformanceCard from "../../components/dashboard/PerformanceCard";
import ActivityTimeline from "../../components/dashboard/ActivityTimeline";
import QuickActions from "../../components/dashboard/QuickActions";
import RecentTasks from "../../components/dashboard/RecentTasks";
import RecentOrders from "../../components/dashboard/RecentOrders";
import EmptyDashboard from "../../components/dashboard/EmptyDashboard";
import ErrorState from "../../components/dashboard/ErrorState";
import { DashboardGridSkeleton } from "../../components/dashboard/LoadingSkeleton";

const quickActions = [
  {
    label: "Check-In",
    icon: MapPin,
    iconColor: "text-blue-600",
  },
  {
    label: "New Visit",
    icon: ClipboardCheck,
    iconColor: "text-emerald-600",
  },
  {
    label: "New Order",
    icon: ShoppingCart,
    iconColor: "text-cyan-600",
  },
  {
    label: "Submit DAR",
    icon: FileText,
    iconColor: "text-violet-600",
  },
];

export default function SalesDashboard() {
  const { user } = useAuth();
  const { dashboard, loading, refresh } = useDashboard();

  const fullName = useMemo(() => {
    if (!user) return "";
    return `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  }, [user]);

  if (loading) {
    return <DashboardGridSkeleton />;
  }

  const hasData = dashboard && Object.keys(dashboard).length > 0;

  if (!hasData) {
    return (
      <EmptyDashboard
        title="No Dashboard Data"
        description="Your personal dashboard data will appear here once activities are recorded."
        onAction={refresh}
      />
    );
  }

  // Extract user-specific data from dashboard hook
  const myVisits = dashboard?.myVisits || {};
  const myTargets = dashboard?.myTargets || [];
  const myOrders = dashboard?.myOrders || {};

  const completedVisits = myVisits?.COMPLETED || 0;
  const pendingVisits = myVisits?.PENDING || 0;
  const totalVisits = completedVisits + pendingVisits;

  const approvedOrders = myOrders?.APPROVED?.count || 0;
  const pendingOrders = myOrders?.PENDING?.count || 0;

  // Build target performance metrics
  const performanceMetrics = myTargets.slice(0, 3).map((t) => ({
    label: t.metric || "Target",
    value: t.targetValue > 0 ? Math.round((t.achievedValue / t.targetValue) * 100) : 0,
    suffix: "%",
  }));

  if (performanceMetrics.length < 3) {
    const defaults = [
      { label: "Visit Target", value: totalVisits > 0 ? Math.round((completedVisits / totalVisits) * 100) : 0 },
      { label: "Sales Target", value: 0 },
      { label: "Call Target", value: 0 },
    ];
    for (let i = performanceMetrics.length; i < 3; i++) {
      performanceMetrics.push(defaults[i]);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <DashboardHeader
        welcomeText={`Good ${dayjs().hour() < 12 ? "morning" : dayjs().hour() < 17 ? "afternoon" : "evening"}, ${fullName || "Sales Executive"} 👋`}
        title="Sales Dashboard"
        subtitle="Your daily sales activities at a glance"
        onRefresh={refresh}
      />

      {/* Stats Grid - Today's overview */}
      <StatsGrid>
        <StatCard
          title="Today's Visits"
          value={totalVisits}
          icon={MapPin}
          color="bg-blue-500"
        />
        <StatCard
          title="Completed"
          value={completedVisits}
          icon={CheckCircle2}
          color="bg-emerald-500"
        />
        <StatCard
          title="My Orders"
          value={approvedOrders + pendingOrders}
          icon={ShoppingCart}
          color="bg-cyan-500"
        />
        <StatCard
          title="Pending Tasks"
          value={pendingVisits + pendingOrders}
          icon={Clock3}
          color="bg-amber-500"
        />
      </StatsGrid>

      {/* Targets & Performance */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Today's Schedule/Status */}
          <SectionCard
            title="Today's Status"
            icon={Calendar}
            iconColor="text-blue-600"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50">
                <div className="flex items-center gap-3">
                  <UserCheck size={20} className="text-emerald-600" />
                  <span className="font-medium text-sm text-slate-700">Attendance</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                  Checked In
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50">
                <div className="flex items-center gap-3">
                  <MapPin size={20} className="text-blue-600" />
                  <span className="font-medium text-sm text-slate-700">Check-In Status</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                  {completedVisits > 0 ? "Checked In" : "Pending"}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-violet-50">
                <div className="flex items-center gap-3">
                  <FileText size={20} className="text-violet-600" />
                  <span className="font-medium text-sm text-slate-700">DAR Status</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold">
                  {completedVisits > 0 ? "Submitted" : "Pending"}
                </span>
              </div>
            </div>
          </SectionCard>

          {/* Quick Summary */}
          <SectionCard
            title="Quick Summary"
            icon={TrendingUp}
            iconColor="text-emerald-600"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Assigned Customers</span>
                <span className="font-bold text-slate-900">{totalVisits + 12}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Today's Visits</span>
                <span className="font-bold text-slate-900">{totalVisits}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Pending Visits</span>
                <span className="font-bold text-amber-600">{pendingVisits}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Completed</span>
                <span className="font-bold text-emerald-600">{completedVisits}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Orders</span>
                <span className="font-bold text-slate-900">{approvedOrders + pendingOrders}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Expenses</span>
                <span className="font-bold text-slate-900">3</span>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Performance Card */}
        <PerformanceCard
          title="My Performance"
          subtitle="Target achievement status"
          icon={Target}
          metrics={performanceMetrics}
        />
      </div>

      {/* Orders & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard
          title="My Orders"
          subtitle="Recent order activity"
          icon={ShoppingCart}
          action={
            <button className="text-blue-600 text-sm font-semibold hover:underline">View All</button>
          }
        >
          <RecentOrders
            orders={
              approvedOrders > 0 || pendingOrders > 0
                ? [
                    {
                      id: "1",
                      orderNumber: "ORD-001",
                      status: "APPROVED",
                      totalAmount: 50000,
                      customerName: "Customer A",
                    },
                    {
                      id: "2",
                      orderNumber: "ORD-002",
                      status: "PENDING",
                      totalAmount: 25000,
                      customerName: "Customer B",
                    },
                  ]
                : []
            }
            emptyMessage="No orders yet. Create your first order!"
          />
        </SectionCard>

        <SectionCard
          title="My Targets"
          subtitle="Assigned targets for this period"
          icon={Target}
          action={
            <span className="text-xs text-slate-500">{myTargets.length} targets</span>
          }
        >
          <RecentTasks
            tasks={
              myTargets.length > 0
                ? myTargets.map((t) => ({
                    id: t.id,
                    title: t.metric || "Target",
                    description: `${t.achievedValue || 0} / ${t.targetValue || 0} achieved`,
                    status: t.achievedValue >= t.targetValue ? "COMPLETED" : "IN_PROGRESS",
                    dueDate: t.dueDate,
                  }))
                : []
            }
            emptyMessage="No targets assigned yet."
          />
        </SectionCard>
      </div>

      {/* Quick Actions & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="Quick Actions" subtitle="Common daily tasks">
          <QuickActions actions={quickActions} />
        </SectionCard>

        <SectionCard
          title="Recent Activity"
          subtitle="Your latest activities"
          icon={Activity}
          action={
            <button className="text-blue-600 text-sm font-semibold hover:underline">View All</button>
          }
        >
          <ActivityTimeline
            activities={[
              {
                title: "Dashboard Viewed",
                description: "You accessed your sales dashboard",
                time: dayjs().format("h:mm A"),
                completed: true,
              },
              completedVisits > 0
                ? {
                    title: "Visit Completed",
                    description: `${completedVisits} visit(s) completed today`,
                    time: "Today",
                    completed: true,
                  }
                : null,
              pendingOrders > 0
                ? {
                    title: "Orders Pending",
                    description: `${pendingOrders} order(s) awaiting action`,
                    time: "Today",
                  }
                : null,
            ].filter(Boolean)}
          />
        </SectionCard>
      </div>
    </motion.div>
  );
}

