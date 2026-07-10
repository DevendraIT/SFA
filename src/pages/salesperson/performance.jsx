import { useState } from "react";
import {
  TrendingUp,
  Target,
  DollarSign,
  Users,
  Calendar,
  ArrowUpRight,
} from "lucide-react";

const stats = [
  { label: "Monthly Sales", value: "₹4.8L", change: "+12%", icon: DollarSign, accent: "from-emerald-500 to-green-600" },
  { label: "Target Achieved", value: "88%", change: "+5%", icon: Target, accent: "from-blue-500 to-cyan-600" },
  { label: "Active Clients", value: "34", change: "+8", icon: Users, accent: "from-violet-500 to-purple-600" },
  { label: "Visits This Week", value: "18", change: "+3", icon: Calendar, accent: "from-amber-500 to-orange-600" },
];

const trendData = [
  { label: "Mon", value: 58 },
  { label: "Tue", value: 72 },
  { label: "Wed", value: 64 },
  { label: "Thu", value: 81 },
  { label: "Fri", value: 76 },
  { label: "Sat", value: 92 },
];

export default function SPPerformance() {
  const [range, setRange] = useState("This Month");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Performance Dashboard</h1>
          <p className="mt-2 text-slate-500">Track your sales progress, target achievement, and weekly activity.</p>
        </div>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option>This Month</option>
          <option>Last Month</option>
          <option>This Quarter</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, change, icon: Icon, accent }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className={`inline-flex rounded-2xl bg-gradient-to-br ${accent} p-3 text-white`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm text-slate-500">{label}</p>
            <div className="mt-2 flex items-center gap-2">
              <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                <ArrowUpRight className="h-3.5 w-3.5" />
                {change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Weekly Sales Trend</h2>
              <p className="text-sm text-slate-500">Performance for the selected period</p>
            </div>
            <div className="rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-600">
              {range}
            </div>
          </div>

          <div className="mt-6 flex h-56 items-end gap-3">
            {trendData.map((item) => (
              <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-40 w-full items-end rounded-2xl bg-slate-100 p-2">
                  <div className="w-full rounded-xl bg-gradient-to-t from-orange-500 to-amber-400" style={{ height: `${item.value}%` }} />
                </div>
                <span className="text-sm font-medium text-slate-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-slate-800">Target Progress</h2>
          </div>
          <div className="mt-6 space-y-4">
            {[
              { label: "Monthly Target", value: 88, color: "bg-orange-500" },
              { label: "Order Target", value: 74, color: "bg-blue-500" },
              { label: "Visit Target", value: 92, color: "bg-emerald-500" },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                  <span>{item.label}</span>
                  <span className="font-semibold text-slate-800">{item.value}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100">
                  <div className={`h-2.5 rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}