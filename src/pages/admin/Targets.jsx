import { useMemo, useState } from "react";
import { Target, TrendingUp, Award, PlusCircle } from "lucide-react";
import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import { useStorage } from "../../hooks/useLocalStorage.js";
import { formatCurrency } from "../../utils/helpers.js";

export default function Targets() {
  const { data: targets, create, update } = useStorage("targets");
  const [selectedUser, setSelectedUser] = useState("all");

  const filteredTargets = useMemo(() => {
    if (selectedUser === "all") return targets;
    return targets.filter((target) => target.userId === selectedUser);
  }, [targets, selectedUser]);

  const handleCreate = () => {
    create({ userId: `user-${Date.now()}`, target: 500000, achieved: 320000, period: "This month" });
  };

  const handleProgress = (target) => {
    update(target.id, { achieved: Math.min(Number(target.achieved || 0) + 25000, Number(target.target || 0)) });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Targets</h1>
          <p className="text-sm text-slate-500 mt-1">Set achievement goals and track progress across the team.</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant={selectedUser === "all" ? "primary" : "secondary"} onClick={() => setSelectedUser("all")}>All</Button>
          <Button size="sm" variant="outline" icon={PlusCircle} onClick={handleCreate}>Add target</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600"><Target size={20} /></div>
            <div>
              <p className="text-sm text-slate-500">Active targets</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{targets.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600"><TrendingUp size={20} /></div>
            <div>
              <p className="text-sm text-slate-500">Average progress</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{Math.round(targets.reduce((sum, item) => sum + (Number(item.achieved || 0) / Math.max(Number(item.target || 1), 1) * 100), 0) / Math.max(targets.length, 1))}%</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600"><Award size={20} /></div>
            <div>
              <p className="text-sm text-slate-500">Best performer</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">Top rep</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4">
        {filteredTargets.map((target) => (
          <Card key={target.id} className="p-5">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Target for {target.userId || "Sales rep"}</h2>
                <p className="text-sm text-slate-500 mt-2">Period: {target.period || "This month"}</p>
                <p className="text-sm text-slate-500">Achieved: {formatCurrency(target.achieved || 0)} / {formatCurrency(target.target || 0)}</p>
              </div>
              <div className="w-full max-w-sm">
                <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500" style={{ width: `${Math.min(100, Math.round(((target.achieved || 0) / Math.max(target.target || 1, 1)) * 100))}%` }} />
                </div>
                <div className="flex justify-end mt-2">
                  <Button size="sm" onClick={() => handleProgress(target)}>Advance progress</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}