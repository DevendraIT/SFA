import { useMemo, useState } from "react";
import { MapPin, Users, CheckCircle2, PhoneCall } from "lucide-react";
import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import { useStorage } from "../../hooks/useLocalStorage.js";

export default function FieldForce() {
  const { data: users } = useStorage("users");
  const [view, setView] = useState("all");

  const fieldTeam = useMemo(() => users.filter((user) => user.role === "SALES_PERSON"), [users]);
  const filteredTeam = useMemo(() => {
    if (view === "all") return fieldTeam;
    return fieldTeam.filter((member) => member.status === view);
  }, [fieldTeam, view]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Field Force</h1>
          <p className="text-sm text-slate-500 mt-1">Track your sales representatives, territory presence, and live engagement.</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant={view === "all" ? "primary" : "secondary"} onClick={() => setView("all")}>All</Button>
          <Button size="sm" variant={view === "Active" ? "primary" : "secondary"} onClick={() => setView("Active")}>Active</Button>
          <Button size="sm" variant={view === "Inactive" ? "primary" : "secondary"} onClick={() => setView("Inactive")}>Inactive</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600"><Users size={20} /></div>
            <div>
              <p className="text-sm text-slate-500">Sales reps</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{fieldTeam.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600"><MapPin size={20} /></div>
            <div>
              <p className="text-sm text-slate-500">Territories covered</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">8</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600"><CheckCircle2 size={20} /></div>
            <div>
              <p className="text-sm text-slate-500">Check-ins today</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">24</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4">
        {filteredTeam.map((member) => (
          <Card key={member.id} className="p-5">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-white">{member.name}</h2>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${member.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{member.status}</span>
                </div>
                <p className="text-sm text-slate-500 mt-2">Territory: {member.territory || "North Zone"}</p>
                <p className="text-sm text-slate-500">Department: {member.department || "Sales"}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" icon={PhoneCall}>Call</Button>
                <Button size="sm">Assign visit</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}