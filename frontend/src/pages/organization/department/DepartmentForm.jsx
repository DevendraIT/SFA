import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import departmentService from "../../../services/department.service";
import branchService from "../../../services/branch.service";
import { Loader2 } from "lucide-react";

export default function DepartmentForm({ department, onClose, onSuccess }) {
  const isEdit = !!department;

  const [form, setForm] = useState({
    branchId: "",
    name: "",
    code: "",
  });
  const [branches, setBranches] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loadingBranches, setLoadingBranches] = useState(true);

  useEffect(() => {
    loadBranches();
    if (department) {
      setForm({
        branchId: department.branchId || "",
        name: department.name || "",
        code: department.code || "",
      });
    }
  }, [department]);

  const loadBranches = async () => {
    try {
      setLoadingBranches(true);
      const res = await branchService.getBranches({ limit: 100 });
      setBranches(res?.data?.branches || []);
    } catch (err) {
      console.error("Failed to load branches:", err);
      toast.error("Failed to load branches");
    } finally {
      setLoadingBranches(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.branchId) {
      toast.error("Please select a branch");
      return;
    }
    if (!form.name.trim()) {
      toast.error("Department name is required");
      return;
    }

    try {
      setSubmitting(true);
      if (isEdit) {
        await departmentService.updateDepartment(department.id, form);
        toast.success("Department updated successfully");
      } else {
        await departmentService.createDepartment(form);
        toast.success("Department created successfully");
      }
      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to save department");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Branch Selection */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Branch <span className="text-red-500">*</span>
        </label>
        {loadingBranches ? (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 size={16} className="animate-spin" />
            Loading branches...
          </div>
        ) : (
          <select
            name="branchId"
            value={form.branchId}
            onChange={handleChange}
            disabled={isEdit}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
          >
            <option value="">Select a branch</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} {b.company?.name ? `(${b.company.name})` : ""}
              </option>
            ))}
          </select>
        )}
        {isEdit && (
          <p className="mt-1 text-xs text-slate-400">
            Branch cannot be changed after creation.
          </p>
        )}
      </div>

      {/* Basic Information */}
      <div className="rounded-xl border border-slate-200 p-5">
        <h3 className="mb-4 text-lg font-semibold text-slate-800">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Department Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter department name"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Department Code
            </label>
            <input
              type="text"
              name="code"
              value={form.code}
              onChange={handleChange}
              placeholder="e.g. DEP-001"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-slate-300 px-6 py-3 text-slate-700 hover:bg-slate-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700 transition disabled:opacity-60"
        >
          {submitting && <Loader2 size={18} className="animate-spin" />}
          {isEdit ? "Update Department" : "Create Department"}
        </button>
      </div>
    </form>
  );
}

