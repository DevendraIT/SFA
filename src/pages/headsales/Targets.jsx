import EntityPage from "../../components/ui/EntityPage.jsx";
import { formatCurrency } from "../../utils/helpers.js";

export default function TargetsPage() {
  return (
    <EntityPage
      title="Targets"
      collection="targets"
      columns={[
        { key: "userName", label: "Team Member" },
        { key: "period", label: "Period" },
        { key: "target", label: "Target", render: (r) => formatCurrency(r.target) },
        { key: "achieved", label: "Achieved", render: (r) => formatCurrency(r.achieved) },
        { key: "status", label: "Status", render: (r) => {
          const pct = r.target ? Math.round((r.achieved / r.target) * 100) : 0;
          return <span className={`font-bold ${pct >= 80 ? "text-emerald-600" : "text-amber-600"}`}>{pct}%</span>;
        }},
      ]}
      fields={[
        { name: "userName", label: "Team Member", required: true },
        { name: "userId", label: "User ID" },
        { name: "period", label: "Period", required: true },
        { name: "target", label: "Target Amount", type: "number", required: true },
        { name: "achieved", label: "Achieved Amount", type: "number" },
        { name: "status", label: "Status", type: "select", options: ["Active", "Completed", "Missed"] },
      ]}
      searchKeys={["userName", "period"]}
      defaultValues={{ status: "Active", achieved: 0, unit: "INR" }}
      theme="blue"
      breadcrumbs={["Head Sales", "Targets"]}
    />
  );
}
