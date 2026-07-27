import { useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  X,
  Building,
  GitBranch,
  Users,
  LayoutGrid,
  UsersRound,
  MapPinned,
  FileText,
} from "lucide-react";

import TeamForm from "./TeamForm";
import toast from "react-hot-toast";
import teamService from "../../../services/team.service";
import useTeams from "../../../hooks/useTeams";

export default function TeamList() {
  const { teams, loading, search, setSearch, reload } = useTeams({
    debounce: true,
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [viewTeam, setViewTeam] = useState(null);

  const handleDelete = async (team) => {
    const confirmed = window.confirm(`Delete "${team.name}" ?`);
    if (!confirmed) return;

    try {
      await teamService.deleteTeam(team.id);
      toast.success("Team deleted");
      reload();
    } catch (err) {
      console.log(err);
      toast.error("Unable to delete team");
    }
  };

  console.log("Teams:", teams);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Team Management
          </h1>
          <p className="text-slate-500 mt-1">
            Manage teams inside your organization.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedTeam(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-white hover:bg-indigo-700 transition"
        >
          <Plus size={18} />
          Create Team
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by team name..."
          className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border bg-white">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-6 py-4 text-left">Team</th>
              <th className="px-6 py-4 text-left">Branch</th>
              <th className="px-6 py-4 text-left">Department</th>
              <th className="px-6 py-4 text-left">Company</th>
              <th className="px-6 py-4 text-center">Users</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-slate-500">
                  Loading teams...
                </td>
              </tr>
            ) : teams.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="flex flex-col items-center justify-center py-16">
                    <UsersRound size={60} className="text-slate-300" />
                    <h3 className="mt-5 text-xl font-semibold text-slate-700">
                      No Teams Found
                    </h3>
                    <p className="mt-2 text-slate-500">
                      Create your first team to get started.
                    </p>
                    <button
                      onClick={() => setShowModal(true)}
                      className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700"
                    >
                      Create Team
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              teams.map((team) => (
                <tr
                  key={team.id}
                  className="border-t hover:bg-slate-50 transition"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-indigo-50 p-2">
                        <UsersRound size={18} className="text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">
                          {team.name}
                        </h4>
                        <p className="text-sm text-slate-500">
                          Created{" "}
                          {team.createdAt
                            ? new Date(team.createdAt).toLocaleDateString()
                            : "-"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <GitBranch size={15} className="text-slate-400" />
                      <span className="text-slate-700">
                        {team.branch?.name || "-"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <LayoutGrid size={15} className="text-slate-400" />
                      <span className="text-slate-700">
                        {team.department?.name || "-"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <Building size={15} className="text-slate-400" />
                      <span className="text-slate-700">
                        {team.branch?.company?.name || "-"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users size={15} className="text-slate-400" />
                      <span>{team._count?.users ?? 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setViewTeam(team)}
                        className="rounded-lg border p-2 hover:bg-slate-100"
                        title="View"
                      >
                        <Eye size={17} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTeam(team);
                          setShowModal(true);
                        }}
                        className="rounded-lg border p-2 hover:bg-slate-100"
                        title="Edit"
                      >
                        <Pencil size={17} />
                      </button>
                      <button
                        onClick={() => handleDelete(team)}
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
          Total Teams :
          <span className="ml-2 font-semibold text-slate-800">
            {teams?.length || 0}
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
          <h4 className="text-sm text-slate-500">Total Teams</h4>
          <h2 className="mt-2 text-3xl font-bold">
            {teams?.length || 0}
          </h2>
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h4 className="text-sm text-slate-500">Total Users</h4>
          <h2 className="mt-2 text-3xl font-bold">
            {teams?.reduce(
              (sum, t) => sum + (t._count?.users || 0),
              0
            )}
          </h2>
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h4 className="text-sm text-slate-500">Avg Users / Team</h4>
          <h2 className="mt-2 text-3xl font-bold">
            {teams?.length > 0
              ? Math.round(
                  teams.reduce((sum, t) => sum + (t._count?.users || 0), 0) /
                    teams.length
                )
              : 0}
          </h2>
        </div>
      </div>

      {/* Create/Edit Team Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setSelectedTeam(null);
              }}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <X size={22} />
            </button>
            <h2 className="mb-6 text-2xl font-bold">
              {selectedTeam ? "Edit Team" : "Create Team"}
            </h2>
            <TeamForm
              team={selectedTeam}
              onClose={() => {
                setShowModal(false);
                setSelectedTeam(null);
              }}
              onSuccess={reload}
            />
          </div>
        </div>
      )}

      {/* Team Details View Modal */}
      {viewTeam && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setViewTeam(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setViewTeam(null)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <X size={22} />
            </button>
            <div className="flex items-center gap-4 mb-6">
              <div className="rounded-xl bg-indigo-100 p-3">
                <UsersRound size={28} className="text-indigo-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {viewTeam.name}
                </h2>
                <p className="text-sm text-slate-500">
                  {viewTeam.createdAt
                    ? `Created ${new Date(viewTeam.createdAt).toLocaleDateString()}`
                    : ""}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {/* Basic Information */}
              <div className="rounded-xl border border-slate-200 p-5">
                <h3 className="mb-4 text-lg font-semibold text-slate-800">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Company</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Building size={16} className="text-slate-400" />
                      <p className="font-medium text-slate-800">
                        {viewTeam.branch?.company?.name || "-"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Branch</p>
                    <div className="flex items-center gap-2 mt-1">
                      <GitBranch size={16} className="text-slate-400" />
                      <p className="font-medium text-slate-800">
                        {viewTeam.branch?.name || "-"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Department</p>
                    <div className="flex items-center gap-2 mt-1">
                      <LayoutGrid size={16} className="text-slate-400" />
                      <p className="font-medium text-slate-800">
                        {viewTeam.department?.name || "Not assigned"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Territory</p>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPinned size={16} className="text-slate-400" />
                      <p className="font-medium text-slate-800">
                        {viewTeam.territory?.name || "Not assigned"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Team Name</p>
                    <p className="font-medium text-slate-800 mt-1">
                      {viewTeam.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Created At</p>
                    <p className="font-medium text-slate-800 mt-1">
                      {viewTeam.createdAt
                        ? new Date(viewTeam.createdAt).toLocaleString()
                        : "-"}
                    </p>
                  </div>
                  {viewTeam.description && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-slate-500">Description</p>
                      <div className="flex items-center gap-2 mt-1">
                        <FileText size={16} className="text-slate-400" />
                        <p className="font-medium text-slate-800">
                          {viewTeam.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Members */}
              <div className="rounded-xl border border-slate-200 p-5">
                <h3 className="mb-4 text-lg font-semibold text-slate-800">
                  Team Members
                </h3>
                {viewTeam.users && viewTeam.users.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {viewTeam.users.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 py-3"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-medium text-indigo-700">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-slate-500">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                    <Users size={40} className="mb-2" />
                    <p>No users assigned to this team</p>
                  </div>
                )}
              </div>

              {/* Statistics */}
              <div className="rounded-xl border border-slate-200 p-5">
                <h3 className="mb-4 text-lg font-semibold text-slate-800">
                  Statistics
                </h3>
                <div>
                  <p className="text-sm text-slate-500">Total Users</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {viewTeam._count?.users ?? 0}
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

