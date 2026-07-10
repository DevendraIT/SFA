import { useState, useEffect } from "react";
import { RevenueLineChart, DonutChart } from "../../components/ui/Charts.jsx";
import { KPICard } from "../../components/ui/Card.jsx";
import EntityPage from "../../components/ui/EntityPage.jsx";
import storage from "../../services/storage.js";
import { formatCurrency } from "../../utils/helpers.js";
import { IndianRupee, TrendingUp, CreditCard } from "lucide-react";

export default function RevenuePage() {
  const [stats, setStats] = useState(() => storage.getDashboardStats());

  useEffect(() => {
    return storage.subscribe(() => setStats(storage.getDashboardStats()));
  }, []);

  const orders = storage.orders.getAll();
  const byStatus = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + Number(o.amount);
    return acc;
  }, {});
  const pieData = Object.entries(byStatus).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-800 dark:text-white">Revenue</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon={IndianRupee} color="bg-blue-600" trend={12} />
        <KPICard title="Avg Order Value" value={formatCurrency(stats.totalOrders ? stats.totalRevenue / stats.totalOrders : 0)} icon={CreditCard} color="bg-emerald-500" />
        <KPICard title="Monthly Growth" value="+18.5%" icon={TrendingUp} color="bg-blue-500" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RevenueLineChart data={storage.getRevenueByMonth()} color="#2563eb" />
        <DonutChart data={pieData.length ? pieData : [{ name: "No Data", value: 1 }]} title="Revenue by Status" centerLabel={(t) => formatCurrency(t)} />
      </div>
    </div>
  );
}
