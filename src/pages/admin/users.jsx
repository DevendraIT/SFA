import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import DataTable from "../../components/ui/DataTable.jsx";
import Modal from "../../components/ui/Modal.jsx";
import { ConfirmDialog } from "../../components/ui/Modal.jsx";
import Button from "../../components/ui/Button.jsx";
import { Select } from "../../components/ui/Input.jsx";
import Input from "../../components/ui/Input.jsx";

import { useStorage } from "../../hooks/useLocalStorage.js";
import { showSuccess, showError } from "../../context/ToastContext.jsx";

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role", render: (r) => r.role?.replace(/_/g, " ") },
  { key: "department", label: "Department" },
  { key: "territory", label: "Territory" },
  { key: "status", label: "Status", render: (r) => (
    <span className={`px-2 py-1 rounded-full text-xs font-bold ${r.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{r.status}</span>
  )},
];

const fields = [
  { name: "name", label: "Full Name", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "password", label: "Password", required: true },
  { name: "phone", label: "Phone" },
  { name: "employeeId", label: "Employee ID" },
  { name: "role", label: "Role", type: "select", options: ["SUPER_ADMIN", "HEAD_SALES", "SALES_MANAGER", "SALES_PERSON"] },
  { name: "department", label: "Department" },
  { name: "territory", label: "Territory" },
  { name: "manager", label: "Manager" },
  { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"] },
];

export default function UsersPage() {
  const { data, create, update, remove, bulkRemove, bulkCreate } = useStorage("users");
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { status: "Active", role: "SALES_PERSON", organizationId: "org-1" },
  });

  const openCreate = () => { setEditItem(null); reset({ status: "Active", role: "SALES_PERSON" }); setModalOpen(true); };
  const openEdit = (item) => { setEditItem(item); reset({ ...item, password: "" }); setModalOpen(true); };

  const onSubmit = (formData) => {
    try {
      const payload = { ...formData };
      if (editItem && !payload.password) delete payload.password;
      if (editItem) { update(editItem.id, payload); showSuccess("User updated"); }
      else { create(payload); showSuccess("User created"); }
      setModalOpen(false);
    } catch { showError("Failed to save user"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Users</h1>
          <p className="text-sm text-slate-500">Manage platform users and roles</p>
        </div>
        <Button icon={Plus} onClick={openCreate}>Add User</Button>
      </div>

      <DataTable
        data={data}
        columns={columns}
        searchKeys={["name", "email", "role", "department"]}
        filters={[
          { key: "role", label: "Role", options: ["SUPER_ADMIN", "HEAD_SALES", "SALES_MANAGER", "SALES_PERSON"] },
          { key: "status", label: "Status", options: ["Active", "Inactive"] },
        ]}
        onView={(r) => { setViewItem(r); setViewModal(true); }}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        onBulkDelete={bulkRemove}
        onImport={(rows) => { bulkCreate(rows); showSuccess(`${rows.length} imported`); }}
        exportFilename="users"
        exportTitle="Users"
        theme="indigo"
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? "Edit User" : "Add User"} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((f) => {
            const rules = f.required && !editItem ? { required: `${f.label} required` } : {};
            if (f.name === "password" && editItem) return null;
            if (f.type === "select") return <Select key={f.name} label={f.label} options={f.options} error={errors[f.name]?.message} {...register(f.name, rules)} />;
            return <Input key={f.name} label={f.label} type={f.type || "text"} error={errors[f.name]?.message} {...register(f.name, { ...rules, ...(f.type === "email" ? { pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" } } : {}) })} />;
          })}
          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editItem ? "Update" : "Create"}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={viewModal} onClose={() => setViewModal(false)} title="User Details">
        {viewItem && fields.filter((f) => f.name !== "password").map((f) => (
          <div key={f.name} className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-sm font-semibold text-slate-500">{f.label}</span>
            <span className="text-sm">{viewItem[f.name] ?? "-"}</span>
          </div>
        ))}
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => { remove(deleteTarget.id); showSuccess("User deleted"); setDeleteTarget(null); }} title="Delete User" message="Remove this user permanently?" />
    </div>
  );
}
