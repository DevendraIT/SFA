import { useMemo, useState } from "react";
import { BrainCircuit, Sparkles, TrendingUp, ArrowRight } from "lucide-react";
import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import { useStorage } from "../../hooks/useLocalStorage.js";

const stages = ["New", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];

export default function AILeads() {
  const { data: leads, update } = useStorage("leads");
  const [filter, setFilter] = useState("all");

  const filteredLeads = useMemo(() => {
    if (filter === "all") return leads;
    return leads.filter((lead) => lead.priority === filter || lead.status === filter);
  }, [filter, leads]);

  const stats = useMemo(() => {
    const qualified = leads.filter((lead) => ["Qualified", "Proposal", "Negotiation"].includes(lead.stage)).length;
    const hot = leads.filter((lead) => lead.priority === "High").length;
    const won = leads.filter((lead) => lead.stage === "Won").length;
    return { qualified, hot, won };
  }, [leads]);

  const handleAdvance = (lead) => {
    const currentIndex = stages.indexOf(lead.stage || "New");
    const nextStage = stages[Math.min(currentIndex + 1, stages.length - 1)];
    update(lead.id, { stage: nextStage, status: nextStage === "Won" ? "Won" : lead.status });
  };

  const handlePriority = (lead) => {
    const nextPriority = lead.priority === "High" ? "Medium" : lead.priority === "Medium" ? "Low" : "High";
    update(lead.id, { priority: nextPriority });
  };

  const handleArchive = (lead) => {
    update(lead.id, { status: "Archived" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">AI Leads</h1>
          <p className="text-sm text-slate-500 mt-1">Prioritize smart opportunities and move them through the pipeline faster.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant={filter === "all" ? "primary" : "secondary"} onClick={() => setFilter("all")}>All</Button>
          <Button size="sm" variant={filter === "High" ? "primary" : "secondary"} onClick={() => setFilter("High")}>High Priority</Button>
          <Button size="sm" variant={filter === "Archived" ? "primary" : "secondary"} onClick={() => setFilter("Archived")}>Archived</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Qualified Deals</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{stats.qualified}</p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-600">
              <TrendingUp size={20} />
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Hot Opportunities</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{stats.hot}</p>
            </div>
            <div className="p-3 rounded-2xl bg-rose-500/15 text-rose-600">
              <Sparkles size={20} />
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Won Leads</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{stats.won}</p>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-500/15 text-indigo-600">
              <BrainCircuit size={20} />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4">
        {filteredLeads.map((lead) => (
          <Card key={lead.id} className="p-5">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-white">{lead.company || lead.name}</h2>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${lead.priority === "High" ? "bg-rose-100 text-rose-700" : lead.priority === "Medium" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                    {lead.priority || "Medium"}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">{lead.stage || "New"}</span>
                </div>
                <p className="text-sm text-slate-500 mt-2">Contact: {lead.contact || lead.owner || "Pending review"}</p>
                <p className="text-sm text-slate-500">Expected value: {lead.amount ? `₹${lead.amount}` : "Awaiting estimate"}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="secondary" onClick={() => handlePriority(lead)}>Priority</Button>
                <Button size="sm" onClick={() => handleAdvance(lead)}>Advance <ArrowRight size={14} /></Button>
                <Button size="sm" variant="ghost" onClick={() => handleArchive(lead)}>Archive</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}