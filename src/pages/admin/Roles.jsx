import EntityPage from "../../components/ui/EntityPage.jsx";

export default function RolesPage() {
  return (
    <EntityPage
      title="Roles"
      subtitle="Manage role definitions and permissions"
      collection="roles"
      columns={[
        { key: "name", label: "Role Name" },
        { key: "code", label: "Code" },
        { key: "permissions", label: "Permissions", render: (r) => (Array.isArray(r.permissions) ? r.permissions.join(", ") : r.permissions) },
        { key: "users", label: "Users" },
        { key: "status", label: "Status" },
      ]}
      fields={[
        { name: "name", label: "Role Name", required: true },
        { name: "code", label: "Code", required: true },
        { name: "permissions", label: "Permissions (comma separated)", required: true },
        { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"] },
      ]}
      searchKeys={["name", "code"]}
      filters={[{ key: "status", label: "Status", options: ["Active", "Inactive"] }]}
      defaultValues={{ status: "Active", permissions: "read,write" }}
      theme="indigo"
      breadcrumbs={["Admin", "Roles"]}
      transformImport={(r) => ({ ...r, permissions: r.permissions?.split(",").map((p) => p.trim()) || [] })}
    />
  );
}
