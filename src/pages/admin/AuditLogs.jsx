import EntityPage from "../../components/ui/EntityPage.jsx";
import { formatDateTime } from "../../utils/helpers.js";

export default function AuditLogsPage() {
  return (
    <EntityPage
      title="Audit Logs"
      subtitle="System activity and security audit trail"
      collection="auditLogs"
      columns={[
        { key: "action", label: "Action" },
        { key: "user", label: "User" },
        { key: "module", label: "Module" },
        { key: "details", label: "Details" },
        { key: "ip", label: "IP" },
        { key: "createdAt", label: "Timestamp", render: (r) => formatDateTime(r.createdAt) },
      ]}
      fields={[
        { name: "action", label: "Action", required: true },
        { name: "user", label: "User", required: true },
        { name: "module", label: "Module", required: true },
        { name: "details", label: "Details", type: "textarea" },
        { name: "ip", label: "IP Address" },
      ]}
      searchKeys={["action", "user", "module", "details"]}
      filters={[{ key: "module", label: "Module", options: ["Auth", "Orders", "Leads", "Users", "Settings"] }]}
      theme="indigo"
      breadcrumbs={["Admin", "Audit Logs"]}
    />
  );
}
