import { useState, useEffect } from "react";
import { RevenueLineChart, LeadsPieChart, OrdersBarChart, PerformanceLineChart } from "../../components/ui/Charts.jsx";
import { KPICard } from "../../components/ui/Card.jsx";
import storage from "../../services/storage.js";
import { formatCurrency } from "../../utils/helpers.js";
import { BarChart3, ShoppingCart, UserPlus } from "lucide-react";

export default function SalesAnalyticsPage() {
  const [stats, setStats] = useState(() => storage.getDashboardStats());
  useEffect(() => { return storage.subscribe(() => setStats(storage.getDashboardStats())); }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-800 dark:text-white">Sales Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Revenue" value={formatCurrency(stats.totalRevenue)} icon={BarChart3} color="bg-blue-600" />
        <KPICard title="Orders" value={stats.totalOrders} icon={ShoppingCart} color="bg-emerald-500" />
        <KPICard title="Leads" value={stats.totalLeads} icon={UserPlus} color="bg-blue-500" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RevenueLineChart data={storage.getRevenueByMonth()} color="#2563eb" />
        <LeadsPieChart data={storage.getLeadsByStage()} />
        <OrdersBarChart data={storage.getRevenueByMonth()} color="#10b981" />
        <PerformanceLineChart data={storage.getRevenueByMonth()} lines={[
          { key: "revenue", color: "#2563eb", name: "Revenue" },
          { key: "orders", color: "#10b981", name: "Orders" },
        ]} />
      </div>
    </div>
  );
}
