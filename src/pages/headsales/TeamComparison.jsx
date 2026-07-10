import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Card from "../../components/ui/Card.jsx";
import storage from "../../services/storage.js";
import { formatCurrency } from "../../utils/helpers.js";

export default function TeamComparisonPage() {
  const [team, setTeam] = useState(() => storage.getTeamPerformance());

  useEffect(() => {
    return storage.subscribe(() => setTeam(storage.getTeamPerformance()));
  }, []);

  const chartData = team.map((t) => ({
    name: t.name.split(" ")[0],
    revenue: t.revenue,
    target: t.target,
    orders: t.orders,
    achievement: t.target ? Math.round((t.achieved / t.target) * 100) : 0,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-800 dark:text-white">Team Comparison</h1>
      <Card className="p-6">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(v, name) => [name === "achievement" ? `${v}%` : formatCurrency(v), name]} />
            <Legend />
            <Bar dataKey="revenue" fill="#2563eb" name="Revenue" radius={[4, 4, 0, 0]} />
            <Bar dataKey="target" fill="#10b981" name="Target" radius={[4, 4, 0, 0]} />
            <Bar dataKey="orders" fill="#f59e0b" name="Orders" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {team.map((member) => (
          <Card key={member.name} className="p-5">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white">{member.name}</h3>
            <div className="grid grid-cols-3 gap-3 mt-3 text-center">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3">
                <p className="text-xs text-slate-500">Revenue</p>
                <p className="font-bold text-blue-600">{formatCurrency(member.revenue)}</p>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3">
                <p className="text-xs text-slate-500">Orders</p>
                <p className="font-bold text-emerald-600">{member.orders}</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3">
                <p className="text-xs text-slate-500">Achievement</p>
                <p className="font-bold text-amber-600">{member.target ? Math.round((member.achieved / member.target) * 100) : 0}%</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
