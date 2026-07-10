import { useState, useEffect } from "react";
import { TrendingUp, Users, IndianRupee, Target } from "lucide-react";
import { KPICard } from "../../components/ui/Card.jsx";
import { RevenueLineChart, TeamBarChart, ActivityTimeline } from "../../components/ui/Charts.jsx";
import PageHeader from "../../components/layout/PageHeader.jsx";
import storage from "../../services/storage.js";
import { formatCurrency } from "../../utils/helpers.js";

export default function HeadSalesDashboard() {
  const [stats, setStats] = useState(() => storage.getDashboardStats());

  useEffect(() => {
    const refresh = () => setStats(storage.getDashboardStats());
    return storage.subscribe(refresh);
  }, []);

  const team = storage.getTeamPerformance();
  const totalTarget = storage.targets.getAll().reduce((s, t) => s + (Number(t.target) || 0), 0);
  const totalAchieved = storage.targets.getAll().reduce((s, t) => s + (Number(t.achieved) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-emerald-500 p-8 text-white shadow-xl">
        <h1 className="text-3xl font-black">Revenue Command</h1>
        <p className="text-blue-100 mt-2">National sales performance overview</p>
        <div className="mt-4 flex gap-4 flex-wrap">
          <div className="bg-white/20 backdrop-blur rounded-2xl px-5 py-3">
            <p className="text-xs text-blue-100">Target Achievement</p>
            <p className="text-2xl font-black">{totalTarget ? Math.round((totalAchieved / totalTarget) * 100) : 0}%</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-2xl px-5 py-3">
            <p className="text-xs text-blue-100">Active Reps</p>
            <p className="text-2xl font-black">{storage.users.getAll().filter((u) => u.role === "SALES_PERSON" && u.status === "Active").length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard title="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon={IndianRupee} color="bg-blue-600" trend={15} />
        <KPICard title="Team Members" value={team.length} icon={Users} color="bg-emerald-500" />
        <KPICard title="Open Leads" value={stats.openLeads} icon={Target} color="bg-blue-500" trend={-3} />
        <KPICard title="Growth Rate" value="18.5%" icon={TrendingUp} color="bg-emerald-600" trend={18} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RevenueLineChart data={storage.getRevenueByMonth()} color="#2563eb" />
        <TeamBarChart data={team} color="#10b981" />
      </div>

      <ActivityTimeline activities={storage.auditLogs.getAll().slice(0, 6)} />
    </div>
  );
}
