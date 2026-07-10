import { useState, useEffect } from "react";
import { Users, Building2, ShoppingCart, IndianRupee, Brain } from "lucide-react";
import { KPICard } from "../../components/ui/Card.jsx";
import { RevenueLineChart, OrdersBarChart, LeadsPieChart, ActivityTimeline, DonutChart } from "../../components/ui/Charts.jsx";
import PageHeader from "../../components/layout/PageHeader.jsx";
import storage from "../../services/storage.js";
import { formatCurrency } from "../../utils/helpers.js";

export default function AdminDashboard() {
  const [stats, setStats] = useState(() => storage.getDashboardStats());
  const [revenue, setRevenue] = useState(() => storage.getRevenueByMonth());
  const [leads, setLeads] = useState(() => storage.getLeadsByStage());
  const [activities, setActivities] = useState(() => storage.auditLogs.getAll().slice(0, 8));

  useEffect(() => {
    const refresh = () => {
      setStats(storage.getDashboardStats());
      setRevenue(storage.getRevenueByMonth());
      setLeads(storage.getLeadsByStage());
      setActivities(storage.auditLogs.getAll().slice(0, 8));
    };
    return storage.subscribe(refresh);
  }, []);

  const orderStatus = storage.orders.getAll().reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});
  const orderPie = Object.entries(orderStatus).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">
      <PageHeader
        roleLabel="Admin"
        title="Command Center"
        subtitle="Enterprise overview — live from your data"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard title="Total Users" value={stats.totalUsers} icon={Users} color="bg-indigo-600" trend={8} />
        <KPICard title="Organizations" value={storage.organizations.getAll().length} icon={Building2} color="bg-violet-600" />
        <KPICard title="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon={IndianRupee} color="bg-emerald-600" trend={12} />
        <KPICard title="Total Orders" value={stats.totalOrders} icon={ShoppingCart} color="bg-amber-500" trend={5} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <RevenueLineChart data={revenue} color="#6366f1" />
          <OrdersBarChart data={revenue} color="#8b5cf6" />
        </div>
        <div className="space-y-4">
          <LeadsPieChart data={leads.length ? leads : [{ name: "No Leads", value: 1 }]} />
          <DonutChart
            data={orderPie.length ? orderPie : [{ name: "No Orders", value: 1 }]}
            title="Orders by Status"
            centerLabel={(t) => t}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ActivityTimeline activities={activities} />
        <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-6 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-8 h-8" />
            <div>
              <h3 className="font-bold text-lg">AI Insights</h3>
              <p className="text-indigo-200 text-sm">{storage.aiInsights.getAll().length} active insights</p>
            </div>
          </div>
          {storage.aiInsights.getAll().slice(0, 3).map((ai) => (
            <div key={ai.id} className="bg-white/10 backdrop-blur rounded-xl p-3 mb-2">
              <p className="font-semibold text-sm">{ai.title}</p>
              <p className="text-xs text-indigo-200 mt-1">{ai.insight}</p>
              <p className="text-xs text-emerald-300 mt-1">{ai.confidence}% confidence</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
