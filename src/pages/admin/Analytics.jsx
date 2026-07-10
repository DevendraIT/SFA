import { useMemo, useState } from "react";
import { RevenueLineChart, OrdersBarChart, LeadsPieChart, TeamBarChart } from "../../components/ui/Charts.jsx";
import { KPICard } from "../../components/ui/Card.jsx";
import Card from "../../components/ui/Card.jsx";
import storage from "../../services/storage.js";
import { formatCurrency } from "../../utils/helpers.js";
import { TrendingUp, Users, Target, BarChart3, CalendarRange, Trophy } from "lucide-react";

export default function AnalyticsPage() {
  const [stats, setStats] = useState(() => storage.getDashboardStats());
  const [period, setPeriod] = useState("This month");

  const revenueData = storage.getRevenueByMonth();
  const leadsData = storage.getLeadsByStage();
  const teamData = storage.getTeamPerformance();

  const insights = useMemo(() => {
    const bestPerformer = teamData.reduce((best, item) => (item.revenue > best.revenue ? item : best), teamData[0] || { name: "N/A", revenue: 0 });
    return [
      { title: "Best rep", value: bestPerformer.name, detail: `${formatCurrency(bestPerformer.revenue)} revenue` },
      { title: "Lead health", value: `${leadsData.length} active stages`, detail: "Pipeline remains healthy" },
      { title: "Forecast", value: `+${Math.round((stats.totalOrders / Math.max(stats.totalLeads, 1)) * 100)}%`, detail: "Conversion momentum" },
    ];
  }, [stats, teamData, leadsData]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">Monitor performance, lead movement, and team efficiency at a glance.</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
          <CalendarRange size={16} />
          <select className="bg-transparent outline-none" value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option>This month</option>
            <option>Quarter</option>
            <option>Year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard title="Revenue" value={formatCurrency(stats.totalRevenue)} icon={TrendingUp} color="bg-indigo-600" subtitle={`${period} overview`} />
        <KPICard title="Customers" value={stats.totalCustomers} icon={Users} color="bg-violet-600" subtitle="Active customer base" />
        <KPICard title="Open Leads" value={stats.openLeads} icon={Target} color="bg-emerald-600" subtitle="Awaiting follow-up" />
        <KPICard title="Conversion Rate" value={`${stats.totalLeads ? Math.round((stats.totalOrders / stats.totalLeads) * 100) : 0}%`} icon={BarChart3} color="bg-amber-500" subtitle="Orders vs leads" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {insights.map((item) => (
          <Card key={item.title} className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600">
                <Trophy size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">{item.title}</p>
                <p className="text-xl font-bold text-slate-800 dark:text-white">{item.value}</p>
                <p className="text-xs text-slate-500">{item.detail}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RevenueLineChart data={revenueData} />
        <LeadsPieChart data={leadsData} />
        <OrdersBarChart data={revenueData} />
        <TeamBarChart data={teamData} />
      </div>
    </div>
  );
}
