import { useState, useEffect } from "react";
import { TeamBarChart, DonutChart } from "../../components/ui/Charts.jsx";
import { KPICard } from "../../components/ui/Card.jsx";
import Card from "../../components/ui/Card.jsx";
import storage from "../../services/storage.js";
import { formatCurrency } from "../../utils/helpers.js";
import { Trophy, Users, TrendingUp } from "lucide-react";

export default function TeamPerformancePage() {
  const [team, setTeam] = useState(() => storage.getTeamPerformance());

  useEffect(() => {
    return storage.subscribe(() => setTeam(storage.getTeamPerformance()));
  }, []);

  const sorted = [...team].sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-800 dark:text-white">Team Performance</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Top Performer" value={sorted[0]?.name || "-"} icon={Trophy} color="bg-emerald-500" subtitle={sorted[0] ? formatCurrency(sorted[0].revenue) : ""} />
        <KPICard title="Team Size" value={team.length} icon={Users} color="bg-blue-600" />
        <KPICard title="Avg Revenue" value={formatCurrency(team.length ? team.reduce((s, t) => s + t.revenue, 0) / team.length : 0)} icon={TrendingUp} color="bg-blue-500" />
      </div>
      <TeamBarChart data={team} color="#10b981" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((member, i) => (
          <Card key={member.name} className="p-5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-white ${i === 0 ? "bg-emerald-500" : "bg-blue-500"}`}>
                #{i + 1}
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-white">{member.name}</p>
                <p className="text-sm text-emerald-600 font-semibold">{formatCurrency(member.revenue)}</p>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Target Progress</span>
                <span>{member.target ? Math.round((member.achieved / member.target) * 100) : 0}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all" style={{ width: `${Math.min(100, member.target ? (member.achieved / member.target) * 100 : 0)}%` }} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
