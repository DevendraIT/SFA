import { useState, useEffect, useMemo } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import userService from "../../../services/user.service";
import roleService from "../../../services/role.service";
import branchService from "../../../services/branch.service";
import departmentService from "../../../services/department.service";
import teamService from "../../../services/team.service";
import { useAuth } from "../../../context/AuthContext";

export default function UserForm({ user, onClose, onSuccess }) {
  const { user: currentUser } = useAuth();
  const isEditMode = !!user;

  const isSalesManager = useMemo(() => {
    if (!currentUser) return false;
    const roleNames = Array.isArray(currentUser.roles)
      ? currentUser.roles.map((r) => (typeof r === "string" ? r : r.role?.name || r.name))
      : [currentUser.role?.name || ""];
    return roleNames.some((r) => r && r.toLowerCase().includes("sales manager"));
  }, [currentUser]);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    branchId: "",
    departmentId: "",
    teamId: "",
    territoryId: "",
    managerId: "",
    roleIds: [],
    isActive: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [roles, setRoles] = useState([]);
  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingDeps, setLoadingDeps] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(false);

  const [managerOrgNames, setManagerOrgNames] = useState({
    companyName: "",
    branchName: "",
    departmentName: "",
    loading: true,
  });

  // Auto-populate structural fields and resolve human-readable names for Sales Manager
  useEffect(() => {
    if (isSalesManager && currentUser) {
      if (!isEditMode) {
        setForm((prev) => ({
          ...prev,
          branchId: currentUser.branchId || prev.branchId,
          departmentId: currentUser.departmentId || prev.departmentId,
          managerId: currentUser.id || prev.managerId,
        }));
      }

      const resolveOrgNames = async () => {
        try {
          let company = currentUser.company?.name || currentUser.branch?.company?.name || "";
          let branch = currentUser.branch?.name || "";
          let department = currentUser.department?.name || "";

          if ((!branch || !company) && currentUser.branchId) {
            try {
              const bRes = await branchService.getBranch(currentUser.branchId);
              const bData = bRes?.data || bRes;
              if (bData) {
                if (bData.name) branch = bData.name;
                if (bData.company?.name) company = bData.company.name;
              }
            } catch (e) {
              console.error("Failed to fetch branch details:", e);
            }
          }

          if (!department && currentUser.departmentId) {
            try {
              const dRes = await departmentService.getDepartment(currentUser.departmentId);
              const dData = dRes?.data || dRes;
              if (dData?.name) department = dData.name;
            } catch (e) {
              console.error("Failed to fetch department details:", e);
            }
          }

          setManagerOrgNames({
            companyName: company || "Assigned Company",
            branchName: branch || "Assigned Branch",
            departmentName: department || "Assigned Department",
            loading: false,
          });
        } catch (err) {
          console.error("Failed to resolve org names:", err);
          setManagerOrgNames((prev) => ({ ...prev, loading: false }));
        }
      };

      resolveOrgNames();
    }
  }, [isSalesManager, isEditMode, currentUser]);


  // Fetch lookup data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises = [
          branchService.getBranches({ limit: 100 }).catch(() => ({ data: { branches: [] } })),
          userService.getUsers({ limit: 100 }).catch(() => ({ data: { users: [] } })),
        ];
        if (!isSalesManager) {
          promises.push(roleService.getRoles({ limit: 100 }).catch(() => ({ data: { roles: [] } })));
        }
        const results = await Promise.all(promises);
        setBranches(results[0]?.data?.branches || results[0]?.branches || []);
        setUsers(results[1]?.data?.users || results[1]?.users || []);
        if (!isSalesManager && results[2]) {
          setRoles(results[2]?.data?.roles || results[2]?.roles || []);
        }
      } catch (err) {
        console.error("Failed to load lookup data:", err);
      }
    };
    fetchData();
  }, [isSalesManager]);



  // Fetch departments when branch changes
  useEffect(() => {
    if (!form.branchId) {
      setDepartments([]);
      setForm((prev) => ({ ...prev, departmentId: "" }));
      return;
    }
    const fetchDepts = async () => {
      setLoadingDeps(true);
      try {
        const res = await departmentService.getDepartments({
          branchId: form.branchId,
          limit: 100,
        });
        setDepartments(res?.data?.departments || []);
      } catch (err) {
        console.error("Failed to load departments:", err);
      } finally {
        setLoadingDeps(false);
      }
    };
    fetchDepts();
  }, [form.branchId]);

  // Fetch teams when branch or department changes
  useEffect(() => {
    if (!form.branchId) {
      setTeams([]);
      setForm((prev) => ({ ...prev, teamId: "" }));
      return;
    }
    const fetchTeams = async () => {
      setLoadingTeams(true);
      try {
        const params = { branchId: form.branchId, limit: 100 };
        if (form.departmentId) params.departmentId = form.departmentId;
        const res = await teamService.getTeams(params);
        setTeams(res?.data?.teams || []);
      } catch (err) {
        console.error("Failed to load teams:", err);
      } finally {
        setLoadingTeams(false);
      }
    };
    fetchTeams();
  }, [form.branchId, form.departmentId]);

  // Populate form in edit mode
  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        password: "",
        phoneNumber: user.phoneNumber || "",
        branchId: user.branchId || "",
        departmentId: user.departmentId || "",
        teamId: user.teamId || "",
        territoryId: user.territoryId || "",
        managerId: user.managerId || "",
        roleIds: user.roles?.map((r) => r.role?.id || r.roleId) || [],
        isActive: user.isActive ?? true,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRoleToggle = (roleId) => {
    setForm((prev) => ({
      ...prev,
      roleIds: prev.roleIds.includes(roleId)
        ? prev.roleIds.filter((id) => id !== roleId)
        : [...prev.roleIds, roleId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.firstName.trim()) return toast.error("First name is required");
    if (!form.lastName.trim()) return toast.error("Last name is required");
    if (!form.email.trim()) return toast.error("Email is required");
    if (!isEditMode && !form.password) return toast.error("Password is required");

    let effectiveRoleIds = form.roleIds;
    if (isSalesManager) {
      const salesExecRole = roles.find((r) => r.name?.toLowerCase().includes("sales executive"));
      if (salesExecRole) {
        effectiveRoleIds = [salesExecRole.id];
      }
    }

    if (!isSalesManager && effectiveRoleIds.length === 0) {
      return toast.error("At least one role must be assigned");
    }

    setSubmitting(true);
    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        phoneNumber: form.phoneNumber.trim() || undefined,
        branchId: form.branchId || undefined,
        departmentId: form.departmentId || undefined,
        teamId: form.teamId || undefined,
        territoryId: form.territoryId || undefined,
        managerId: isSalesManager ? currentUser?.id : form.managerId || undefined,
        roleIds: effectiveRoleIds,
        isActive: form.isActive,
      };


      if (!isEditMode) {
        payload.password = form.password;
      }

      if (isEditMode) {
        await userService.updateUser(user.id, payload);
        toast.success("User updated successfully");
      } else {
        await userService.createUser(payload);
        toast.success("User created successfully");
      }

      onSuccess?.();
      onClose?.();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.message ||
        "Failed to save user";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            className={inputClass}
            placeholder="John"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            className={inputClass}
            placeholder="Doe"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className={inputClass}
          placeholder="john@example.com"
        />
      </div>

      {/* Password (only for create) */}
      {!isEditMode && (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              className={inputClass + " pr-10"}
              placeholder="Min 8 chars, upper, lower, number, special"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Must contain uppercase, lowercase, number & special character
          </p>
        </div>
      )}

      {/* Phone */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Phone Number</label>
        <input
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
          className={inputClass}
          placeholder="+1 234 567 890"
        />
      </div>

      {/* Structural Assignments */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Company, Branch, Department, Role (Human-readable names, read-only for Sales Manager) */}
        {isSalesManager && (
          <div className="md:col-span-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Assigned Scope & Assigned Role (Read-Only)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Company</label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={
                    managerOrgNames.companyName ||
                    currentUser?.company?.name ||
                    currentUser?.branch?.company?.name ||
                    branches.find((b) => b.id === form.branchId)?.company?.name ||
                    "Assigned Company"
                  }
                  className={inputClass + " bg-slate-100 font-medium text-slate-700 cursor-not-allowed"}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Branch</label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={
                    managerOrgNames.branchName ||
                    branches.find((b) => b.id === form.branchId)?.name ||
                    currentUser?.branch?.name ||
                    "Assigned Branch"
                  }
                  className={inputClass + " bg-slate-100 font-medium text-slate-700 cursor-not-allowed"}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Department</label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={
                    managerOrgNames.departmentName ||
                    departments.find((d) => d.id === form.departmentId)?.name ||
                    currentUser?.department?.name ||
                    "Assigned Department"
                  }
                  className={inputClass + " bg-slate-100 font-medium text-slate-700 cursor-not-allowed"}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Assigned Role</label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value="Sales Executive"
                  className={inputClass + " bg-slate-100 font-semibold text-indigo-700 cursor-not-allowed"}
                />
              </div>
            </div>
          </div>
        )}

        {/* Branch (Standard Dropdown for non-Sales Manager) */}
        {!isSalesManager && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Branch</label>
            <select
              name="branchId"
              value={form.branchId}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select Branch</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Department (Standard Dropdown for non-Sales Manager) */}
        {!isSalesManager && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Department</label>
            <select
              name="departmentId"
              value={form.departmentId}
              onChange={handleChange}
              className={inputClass}
              disabled={!form.branchId || loadingDeps}
            >
              <option value="">
                {loadingDeps ? "Loading..." : !form.branchId ? "Select branch first" : "Select Department"}
              </option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Team */}
        <div className={isSalesManager ? "md:col-span-3" : ""}>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Team</label>
          <select
            name="teamId"
            value={form.teamId}
            onChange={handleChange}
            className={inputClass}
            disabled={(!form.branchId && !isSalesManager) || loadingTeams}
          >
            <option value="">
              {loadingTeams ? "Loading..." : (!form.branchId && !isSalesManager) ? "Select branch first" : "Select Team (Optional)"}
            </option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Manager (Hidden for Sales Manager) */}
      {!isSalesManager && (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Manager</label>
          <select
            name="managerId"
            value={form.managerId}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">No Manager</option>
            {users
              .filter((u) => u.id !== user?.id)
              .map((u) => (
                <option key={u.id} value={u.id}>
                  {u.firstName} {u.lastName} ({u.email})
                </option>
              ))}
          </select>
        </div>
      )}

      {/* Roles (Hidden for Sales Manager) */}
      {!isSalesManager && (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Roles <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-3 rounded-lg border border-slate-200 p-4">
            {roles.length === 0 && (
              <p className="text-sm text-slate-400">No roles available</p>
            )}
            {roles.map((role) => (
              <label
                key={role.id}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm transition ${
                  form.roleIds.includes(role.id)
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={form.roleIds.includes(role.id)}
                  onChange={() => handleRoleToggle(role.id)}
                  className="sr-only"
                />
                {role.name}
              </label>
            ))}
          </div>
        </div>
      )}


      {/* Active Status */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="isActive"
          checked={form.isActive}
          onChange={handleChange}
          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label className="text-sm font-medium text-slate-700">Active</label>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 border-t pt-5">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition disabled:opacity-60"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          {isEditMode ? "Update User" : "Create User"}
        </button>
      </div>
    </form>
  );
}

