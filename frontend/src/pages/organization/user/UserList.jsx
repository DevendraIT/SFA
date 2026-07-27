import { useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Users,
  Eye,
  X,
  Mail,
  Phone,
  Shield,
  Building,
  GitBranch,
  LayoutGrid,
  UserCircle,
  UserCog,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

import UserForm from "./UserForm";
import toast from "react-hot-toast";
import userService from "../../../services/user.service";
import useUsers from "../../../hooks/useUsers";

export default function UserList() {
  const { users, loading, search, setSearch, reload } = useUsers({
    debounce: true,
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewUser, setViewUser] = useState(null);

  const handleDelete = async (user) => {
    const confirmed = window.confirm(
      `Delete "${user.firstName} ${user.lastName}" ?`
    );
    if (!confirmed) return;

    try {
      await userService.deleteUser(user.id);
      toast.success("User deleted");
      reload();
    } catch (err) {
      console.log(err);
      toast.error("Unable to delete user");
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      if (user.isActive) {
        await userService.deactivateUser(user.id);
        toast.success("User deactivated");
      } else {
        await userService.activateUser(user.id);
        toast.success("User activated");
      }
      reload();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update status");
    }
  };

  console.log("Users:", users);

  const getInitials = (firstName, lastName) => {
    return `${(firstName?.[0] || "").toUpperCase()}${(lastName?.[0] || "").toUpperCase()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            User Management
          </h1>
          <p className="text-slate-500 mt-1">
            Manage users inside your organization.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedUser(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-white hover:bg-indigo-700 transition"
        >
          <Plus size={18} />
          Create User
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search
          size={18}
          className="absolute left-4 top-3.5 text-slate-400"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email..."
          className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border bg-white">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-6 py-4 text-left">User</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Roles</th>
              <th className="px-6 py-4 text-left">Branch</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-slate-500">
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="flex flex-col items-center justify-center py-16">
                    <Users size={60} className="text-slate-300" />
                    <h3 className="mt-5 text-xl font-semibold text-slate-700">
                      No Users Found
                    </h3>
                    <p className="mt-2 text-slate-500">
                      Create your first user to get started.
                    </p>
                    <button
                      onClick={() => setShowModal(true)}
                      className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700"
                    >
                      Create User
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t hover:bg-slate-50 transition"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
                        {getInitials(user.firstName, user.lastName)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">
                          {user.firstName} {user.lastName}
                        </h4>
                        <p className="text-sm text-slate-500">
                          {user.phoneNumber || "No phone"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail size={15} />
                      <span>{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-1">
                      {user.roles?.length > 0 ? (
                        user.roles.map((ur) => (
                          <span
                            key={ur.role?.id}
                            className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700"
                          >
                            <Shield size={11} />
                            {ur.role?.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-slate-400">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Building size={15} />
                      <span>{user.branch?.name || "-"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <button
                      onClick={() => handleToggleStatus(user)}
                      title={user.isActive ? "Deactivate" : "Activate"}
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition ${
                        user.isActive
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                    >
                      {user.isActive ? (
                        <ToggleRight size={14} />
                      ) : (
                        <ToggleLeft size={14} />
                      )}
                      {user.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setViewUser(user)}
                        className="rounded-lg border p-2 hover:bg-slate-100"
                        title="View"
                      >
                        <Eye size={17} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowModal(true);
                        }}
                        className="rounded-lg border p-2 hover:bg-slate-100"
                        title="Edit"
                      >
                        <Pencil size={17} />
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
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
          Total Users :
          <span className="ml-2 font-semibold text-slate-800">
            {users?.length || 0}
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
          <h4 className="text-sm text-slate-500">Total Users</h4>
          <h2 className="mt-2 text-3xl font-bold">
            {users?.length || 0}
          </h2>
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h4 className="text-sm text-slate-500">Active Users</h4>
          <h2 className="mt-2 text-3xl font-bold">
            {users?.filter((u) => u.isActive).length || 0}
          </h2>
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h4 className="text-sm text-slate-500">Inactive Users</h4>
          <h2 className="mt-2 text-3xl font-bold">
            {users?.filter((u) => !u.isActive).length || 0}
          </h2>
        </div>
      </div>

      {/* Create/Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setSelectedUser(null);
              }}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <X size={22} />
            </button>
            <h2 className="mb-6 text-2xl font-bold">
              {selectedUser ? "Edit User" : "Create User"}
            </h2>
            <UserForm
              user={selectedUser}
              onClose={() => {
                setShowModal(false);
                setSelectedUser(null);
              }}
              onSuccess={reload}
            />
          </div>
        </div>
      )}

      {/* User Details View Modal */}
      {viewUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setViewUser(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setViewUser(null)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <X size={22} />
            </button>

            {/* User Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-600">
                {getInitials(viewUser.firstName, viewUser.lastName)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {viewUser.firstName} {viewUser.lastName}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Mail size={14} className="text-slate-400" />
                  <span className="text-sm text-slate-500">{viewUser.email}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {/* Basic Information */}
              <div className="rounded-xl border border-slate-200 p-5">
                <h3 className="mb-4 text-lg font-semibold text-slate-800">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Full Name</p>
                    <p className="font-medium text-slate-800 mt-1">
                      {viewUser.firstName} {viewUser.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <p className="font-medium text-slate-800 mt-1">{viewUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Phone</p>
                    <p className="font-medium text-slate-800 mt-1">{viewUser.phoneNumber || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Status</p>
                    <span
                      className={`mt-1 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                        viewUser.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {viewUser.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Created At</p>
                    <p className="font-medium text-slate-800 mt-1">
                      {viewUser.createdAt
                        ? new Date(viewUser.createdAt).toLocaleString()
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Email Verified</p>
                    <p className="font-medium text-slate-800 mt-1">
                      {viewUser.emailVerifiedAt ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Organization Structure */}
              <div className="rounded-xl border border-slate-200 p-5">
                <h3 className="mb-4 text-lg font-semibold text-slate-800">Organization Structure</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Branch</p>
                    <div className="flex items-center gap-2 mt-1">
                      <GitBranch size={15} className="text-slate-400" />
                      <p className="font-medium text-slate-800">{viewUser.branch?.name || "-"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Department</p>
                    <div className="flex items-center gap-2 mt-1">
                      <LayoutGrid size={15} className="text-slate-400" />
                      <p className="font-medium text-slate-800">{viewUser.department?.name || "-"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Team</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Users size={15} className="text-slate-400" />
                      <p className="font-medium text-slate-800">{viewUser.team?.name || "-"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Territory</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Building size={15} className="text-slate-400" />
                      <p className="font-medium text-slate-800">{viewUser.territory?.name || "-"}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-slate-500">Manager</p>
                  <div className="flex items-center gap-2 mt-1">
                    <UserCircle size={15} className="text-slate-400" />
                    <p className="font-medium text-slate-800">
                      {viewUser.manager
                        ? `${viewUser.manager.firstName} ${viewUser.manager.lastName}`
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Roles */}
              <div className="rounded-xl border border-slate-200 p-5">
                <h3 className="mb-4 text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <Shield size={18} className="text-purple-500" />
                  Roles
                </h3>
                <div className="flex flex-wrap gap-2">
                  {viewUser.roles?.length > 0 ? (
                    viewUser.roles.map((ur) => (
                      <span
                        key={ur.role?.id}
                        className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1.5 text-sm font-medium text-purple-700"
                      >
                        <Shield size={13} />
                        {ur.role?.name}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400">No roles assigned</p>
                  )}
                </div>
              </div>

              {/* Subordinates Count */}
              <div className="rounded-xl border border-slate-200 p-5">
                <h3 className="mb-4 text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <UserCog size={18} className="text-slate-400" />
                  Management
                </h3>
                <div>
                  <p className="text-sm text-slate-500">Direct Reports</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">
                    {viewUser._count?.subordinates ?? 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

