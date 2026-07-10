import { useState } from "react";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import DataTable from "./DataTable.jsx";
import Modal from "./Modal.jsx";
import { ConfirmDialog } from "./Modal.jsx";
import Button from "./Button.jsx";
import { Input, Select, Textarea } from "./Input.jsx";
import { useStorage } from "../../hooks/useLocalStorage.js";
import { showSuccess, showError } from "../../context/ToastContext.jsx";

export default function EntityPage({
  title,
  subtitle,
  collection,
  columns,
  fields,
  searchKeys,
  filters,
  defaultValues = {},
  theme = "indigo",
  breadcrumbs,
  transformImport,
}) {
  const { data, create, update, remove, bulkRemove, bulkCreate } = useStorage(collection);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues,
  });

  const openCreate = () => {
    setEditItem(null);
    reset(defaultValues);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    reset(item);
    setModalOpen(true);
  };

  const openView = (item) => {
    setViewItem(item);
    setViewModal(true);
  };

  const onSubmit = (formData) => {
    try {
      if (editItem) {
        update(editItem.id, formData);
        showSuccess("Record updated successfully");
      } else {
        create(formData);
        showSuccess("Record created successfully");
      }
      setModalOpen(false);
      reset(defaultValues);
    } catch {
      showError("Failed to save record");
    }
  };

  const handleDelete = (item) => setDeleteTarget(item);

  const confirmDelete = () => {
    if (deleteTarget) {
      remove(deleteTarget.id);
      showSuccess("Record deleted successfully");
      setDeleteTarget(null);
    }
  };

  const handleBulkDelete = (ids) => {
    bulkRemove(ids);
    showSuccess(`${ids.length} records deleted`);
  };

  const handleImport = (rows) => {
    const mapped = transformImport ? rows.map(transformImport) : rows;
    bulkCreate(mapped);
    showSuccess(`${mapped.length} records imported`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {breadcrumbs && (
        <nav className="text-sm text-slate-500 flex items-center gap-2">
          {breadcrumbs.map((b, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span>/</span>}
              <span className={i === breadcrumbs.length - 1 ? "text-slate-800 dark:text-white font-semibold" : ""}>{b}</span>
            </span>
          ))}
        </nav>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <Button icon={Plus} onClick={openCreate}>Add New</Button>
      </div>

      <DataTable
        data={data}
        columns={columns}
        searchKeys={searchKeys}
        filters={filters}
        onView={openView}
        onEdit={openEdit}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        onImport={handleImport}
        exportFilename={collection}
        exportTitle={title}
        theme={theme}
      />

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? `Edit ${title}` : `Add ${title}`}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => {
              const rules = field.required ? { required: `${field.label} is required` } : {};
              if (field.type === "select") {
                return (
                  <Select
                    key={field.name}
                    label={field.label}
                    options={field.options}
                    error={errors[field.name]?.message}
                    {...register(field.name, rules)}
                  />
                );
              }
              if (field.type === "textarea") {
                return (
                  <Textarea
                    key={field.name}
                    label={field.label}
                    className={field.fullWidth ? "md:col-span-2" : ""}
                    error={errors[field.name]?.message}
                    {...register(field.name, rules)}
                  />
                );
              }
              return (
                <Input
                  key={field.name}
                  label={field.label}
                  type={field.type || "text"}
                  error={errors[field.name]?.message}
                  {...register(field.name, {
                    ...rules,
                    ...(field.type === "email" ? { pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" } } : {}),
                    ...(field.type === "number" ? { valueAsNumber: true } : {}),
                  })}
                />
              );
            })}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editItem ? "Update" : "Create"}</Button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal open={viewModal} onClose={() => setViewModal(false)} title="View Details">
        {viewItem && (
          <div className="space-y-3">
            {fields.map((field) => (
              <div key={field.name} className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-sm font-semibold text-slate-500">{field.label}</span>
                <span className="text-sm text-slate-800 dark:text-white">{viewItem[field.name] ?? "-"}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this record? This action cannot be undone."
      />
    </div>
  );
}
