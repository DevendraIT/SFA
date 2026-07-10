import EntityPage from "../../components/ui/EntityPage.jsx";
import { formatDate } from "../../utils/helpers.js";

const columns = [
  { key: "name", label: "Organization" },
  { key: "code", label: "Code" },
  { key: "industry", label: "Industry" },
  { key: "city", label: "City" },
  { key: "employees", label: "Employees" },
  { key: "status", label: "Status", render: (r) => (
    <span className={`px-2 py-1 rounded-full text-xs font-bold ${r.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>{r.status}</span>
  )},
];

const fields = [
  { name: "name", label: "Organization Name", required: true },
  { name: "code", label: "Code", required: true },
  { name: "industry", label: "Industry", type: "select", options: ["FMCG", "Pharma", "Electronics", "Automotive", "Other"] },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", required: true },
  { name: "address", label: "Address", type: "textarea", fullWidth: true },
  { name: "city", label: "City", required: true },
  { name: "state", label: "State", required: true },
  { name: "country", label: "Country", required: true },
  { name: "employees", label: "Employees", type: "number" },
  { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"] },
];

export default function OrganizationsPage() {
  return (
    <EntityPage
      title="Organizations"
      subtitle="Manage enterprise organizations"
      collection="organizations"
      columns={columns}
      fields={fields}
      searchKeys={["name", "code", "city", "industry"]}
      filters={[{ key: "status", label: "Status", options: ["Active", "Inactive"] }]}
      defaultValues={{ status: "Active", country: "India", employees: 0 }}
      theme="indigo"
      breadcrumbs={["Admin", "Organizations"]}
    />
  );
}
