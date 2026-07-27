import { useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Building2,
  GitBranch,
  Eye,
  X,
  Building,
  Users,
} from "lucide-react";

import BranchForm from "./BranchForm";
import toast from "react-hot-toast";
import branchService from "../../../services/branch.service";
import useBranches from "../../../hooks/useBranches";

export default function BranchList() {
  const { branches, loading, search, setSearch, reload } = useBranches({
    debounce: true,
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [viewBranch, setViewBranch] = useState(null);

  const handleDelete = async (branch) => {
    const confirmed = window.confirm(`Delete "${branch.name}" ?`);
    if (!confirmed) return;

    try {
      await branchService.deleteBranch(branch.id);
      toast.success("Branch deleted");
      reload();
    } catch (err) {
      console.log(err);
      toast.error("Unable to delete branch");
    }
  };

  console.log("Branches:", branches);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Branch Management
          </h1>
          <p className="text-slate-500 mt-1">
            Manage branches inside your organization.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedBranch(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-white hover:bg-indigo-700 transition"
        >
          <Plus size={18} />
          Create Branch
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by branch name..."
          className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border bg-white">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-6 py-4 text-left">Branch</th>
              <th className="px-6 py-4 text-left">Code</th>
              <th className="px-6 py-4 text-left">Company</th>
              <th className="px-6 py-4 text-center">Departments</th>
              <th className="px-6 py-4 text-center">Teams</th>
              <th className="px-6 py-4 text-center">Users</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-slate-500">
                  Loading branches...
                </td>
              </tr>
            ) : branches.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="flex flex-col items-center justify-center py-16">
                    <GitBranch size={60} className="text-slate-300" />
                    <h3 className="mt-5 text-xl font-semibold text-slate-700">
                      No Branches Found
                    </h3>
                    <p className="mt-2 text-slate-500">
                      Create your first branch to get started.
                    </p>
                    <button
                      onClick={() => setShowModal(true)}
                      className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700"
                    >
                      Create Branch
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              branches.map((branch) => (
                <tr
                  key={branch.id}
                  className="border-t hover:bg-slate-50 transition"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-indigo-50 p-2">
                        <GitBranch size={18} className="text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">
                          {branch.name}
                        </h4>
                        <p className="text-sm text-slate-500">
                          Created{" "}
                          {branch.createdAt
                            ? new Date(branch.createdAt).toLocaleDateString()
                            : "-"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-slate-600">
                    {branch.code || "-"}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <Building size={15} className="text-slate-400" />
                      <span className="text-slate-700">
                        {branch.company?.name || "-"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    {branch._count?.departments ?? 0}
                  </td>
                  <td className="px-6 py-5 text-center">
                    {branch._count?.teams ?? 0}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users size={15} className="text-slate-400" />
                      <span>{branch._count?.users ?? 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setViewBranch(branch)}
                        className="rounded-lg border p-2 hover:bg-slate-100"
                        title="View"
                      >
                        <Eye size={17} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedBranch(branch);
                          setShowModal(true);
                        }}
                        className="rounded-lg border p-2 hover:bg-slate-100"
                        title="Edit"
                      >
                        <Pencil size={17} />
                      </button>
                      <button
                        onClick={() => handleDelete(branch)}
                        className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Total Branches :
          <span className="ml-2 font-semibold text-slate-800">
            {branches?.length || 0}
          </span>
        </p>
        <div className="flex gap-3">
          <button
            disabled
            className="rounded-lg border px-4 py-2 text-sm text-slate-400 opacity-60 cursor-not-allowed"
          >
            Previous
          </button>
          <button
            disabled
            className="rounded-lg border px-4 py-2 text-sm text-slate-400 opacity-60 cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h4 className="text-sm text-slate-500">Total Branches</h4>
          <h2 className="mt-2 text-3xl font-bold">
            {branches?.length || 0}
          </h2>
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h4 className="text-sm text-slate-500">Total Departments</h4>
          <h2 className="mt-2 text-3xl font-bold">
            {branches?.reduce(
              (sum, b) => sum + (b._count?.departments || 0),
              0
            )}
          </h2>
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h4 className="text-sm text-slate-500">Total Users</h4>
          <h2 className="mt-2 text-3xl font-bold">
            {branches?.reduce(
              (sum, b) => sum + (b._count?.users || 0),
              0
            )}
          </h2>
        </div>
      </div>

      {/* Create/Edit Branch Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setSelectedBranch(null);
              }}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <X size={22} />
            </button>
            <h2 className="mb-6 text-2xl font-bold">
              {selectedBranch ? "Edit Branch" : "Create Branch"}
            </h2>
            <BranchForm
              branch={selectedBranch}
              onClose={() => {
                setShowModal(false);
                setSelectedBranch(null);
              }}
              onSuccess={reload}
            />
          </div>
        </div>
      )}

      {/* Branch Details View Modal */}
      {viewBranch && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setViewBranch(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setViewBranch(null)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <X size={22} />
            </button>
            <div className="flex items-center gap-4 mb-6">
              <div className="rounded-xl bg-indigo-100 p-3">
                <GitBranch size={28} className="text-indigo-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{viewBranch.name}</h2>
                <p className="text-sm text-slate-500">
                  {viewBranch.code ? `Code: ${viewBranch.code}` : ""}
                  {viewBranch.code && viewBranch.createdAt ? " | " : ""}
                  {viewBranch.createdAt
                    ? `Created ${new Date(viewBranch.createdAt).toLocaleDateString()}`
                    : ""}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {/* Basic Information */}
              <div className="rounded-xl border border-slate-200 p-5">
                <h3 className="mb-4 text-lg font-semibold text-slate-800">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Company</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Building size={16} className="text-slate-400" />
                      <p className="font-medium text-slate-800">
                        {viewBranch.company?.name || "-"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Branch Name</p>
                    <p className="font-medium text-slate-800 mt-1">{viewBranch.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Branch Code</p>
                    <p className="font-medium text-slate-800 mt-1">{viewBranch.code || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Created At</p>
                    <p className="font-medium text-slate-800 mt-1">
                      {viewBranch.createdAt
                        ? new Date(viewBranch.createdAt).toLocaleString()
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="rounded-xl border border-slate-200 p-5">
                <h3 className="mb-4 text-lg font-semibold text-slate-800">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <p className="font-medium text-slate-800 mt-1">{viewBranch.email || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Phone</p>
                    <p className="font-medium text-slate-800 mt-1">{viewBranch.phone || "-"}</p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="rounded-xl border border-slate-200 p-5">
                <h3 className="mb-4 text-lg font-semibold text-slate-800">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <p className="text-sm text-slate-500">Address</p>
                    <p className="font-medium text-slate-800 mt-1">{viewBranch.address || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">City</p>
                    <p className="font-medium text-slate-800 mt-1">{viewBranch.city || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">State</p>
                    <p className="font-medium text-slate-800 mt-1">{viewBranch.state || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Country</p>
                    <p className="font-medium text-slate-800 mt-1">{viewBranch.country || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Postal Code</p>
                    <p className="font-medium text-slate-800 mt-1">{viewBranch.postalCode || "-"}</p>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="rounded-xl border border-slate-200 p-5">
                <h3 className="mb-4 text-lg font-semibold text-slate-800">Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Departments</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {viewBranch._count?.departments ?? 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Teams</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {viewBranch._count?.teams ?? 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Users</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {viewBranch._count?.users ?? 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

