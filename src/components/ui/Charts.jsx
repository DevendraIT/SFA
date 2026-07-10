import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import Card from "./Card.jsx";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

export function RevenueLineChart({ data, color = "#6366f1" }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Revenue Trend</h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`, "Revenue"]} />
          <Area type="monotone" dataKey="revenue" stroke={color} fill="url(#revGrad)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function OrdersBarChart({ data, color = "#6366f1" }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Orders Overview</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="orders" fill={color} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function LeadsPieChart({ data }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Leads by Stage</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function TeamBarChart({ data, color = "#6366f1" }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Team Performance</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis type="number" tick={{ fontSize: 12 }} />
          <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`, "Revenue"]} />
          <Bar dataKey="revenue" fill={color} radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function PerformanceLineChart({ data, lines = [{ key: "revenue", color: "#6366f1", name: "Revenue" }] }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Performance Trend</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          {lines.map((l) => (
            <Line key={l.key} type="monotone" dataKey={l.key} stroke={l.color} strokeWidth={2} name={l.name} dot={{ r: 4 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function DonutChart({ data, title, centerLabel }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">{title}</h3>
      <div className="relative">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={70} outerRadius={95} dataKey="value" paddingAngle={3}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        {centerLabel && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{centerLabel(total)}</p>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-3 mt-2 justify-center">
        {data.map((d, i) => (
          <span key={d.name} className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
            {d.name}
          </span>
        ))}
      </div>
    </Card>
  );
}

export function ActivityTimeline({ activities }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Recent Activity</h3>
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {activities.map((a, i) => (
          <div key={a.id || i} className="flex gap-3">
            <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500 shrink-0" />
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-white">{a.action || a.title}</p>
              <p className="text-xs text-slate-500">{a.details || a.message}</p>
              <p className="text-xs text-slate-400 mt-0.5">{new Date(a.createdAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default { RevenueLineChart, OrdersBarChart, LeadsPieChart, TeamBarChart, PerformanceLineChart, DonutChart, ActivityTimeline };
