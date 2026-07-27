import { useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, RefreshCw, UserPlus } from "lucide-react";
import useManagerTasks from "../../hooks/useManagerTasks";
import useTeamMembers from "../../hooks/useTeamMembers";
import TaskTable from "../../components/team/TaskTable";
import TaskCard from "../../components/team/TaskCard";
import TaskFilters from "../../components/team/TaskFilters";
import AssignTaskModal from "../../components/team/AssignTaskModal";
import ErrorState from "../../components/dashboard/ErrorState";

export default function AssignedTasks() {
  const { tasks, loading, error, refresh } = useManagerTasks();
  const { members } = useTeamMembers();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState(null);
  const [executiveFilter, setExecutiveFilter] = useState(null);
  const [viewMode, setViewMode] = useState("card");
  const [showAssignModal, setShowAssignModal] = useState(false);

  const filteredTasks = tasks.filter((t) => {
    if (statusFilter && t.status !== statusFilter) return false;
    if (priorityFilter && t.priority !== priorityFilter) return false;
    if (executiveFilter && t.assignedToId !== executiveFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const titleMatch = (t.title || "").toLowerCase().includes(q);
      const descMatch = (t.description || "").toLowerCase().includes(q);
      const assigneeMatch = t.assignedTo
        ? `${t.assignedTo.firstName || ""} ${t.assignedTo.lastName || ""}`.toLowerCase().includes(q)
        : false;
      if (!titleMatch && !descMatch && !assigneeMatch) return false;
    }
    return true;
  });

  const taskSummary = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "PENDING").length,
    inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    completed: tasks.filter((t) => t.status === "COMPLETED").length,
    cancelled: tasks.filter((t) => t.status === "CANCELLED").length,
  };

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message="Failed to load tasks" onRetry={refresh} />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Assigned Tasks</h1>
          <p className="text-slate-500 mt-1">View and manage all tasks assigned to your team</p>
        </div>
        <div className="flex gap-3">
          <button onClick={refresh} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-medium hover:bg-slate-50 transition">
            <RefreshCw size={16} /> Refresh
          </button>
          <button onClick={() => setShowAssignModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition">
            <UserPlus size={16} /> Assign Task
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs text-slate-500">Total</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{taskSummary.total}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs text-slate-500">Pending</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{taskSummary.pending}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs text-slate-500">In Progress</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{taskSummary.inProgress}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs text-slate-500">Completed</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{taskSummary.completed}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs text-slate-500">Cancelled</p>
          <p className="text-2xl font-bold text-red-500 mt-1">{taskSummary.cancelled}</p>
        </div>
      </div>

      {/* Filters */}
      <TaskFilters
        search={search} onSearchChange={setSearch}
        status={statusFilter} onStatusChange={setStatusFilter}
        priority={priorityFilter} onPriorityChange={setPriorityFilter}
        executiveId={executiveFilter} onExecutiveChange={setExecutiveFilter}
        executives={members}
      />

      {/* View Toggle */}
      <div className="flex justify-end">
        <div className="flex gap-2 bg-slate-100 rounded-xl p-1">
          <button onClick={() => setViewMode("card")} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${viewMode === "card" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Cards</button>
          <button onClick={() => setViewMode("list")} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${viewMode === "list" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Table</button>
        </div>
      </div>

      {/* Tasks */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (<TaskCard key={i} loading={true} />))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
          <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
            <ClipboardList size={28} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mt-4">No Tasks Found</h3>
          <p className="text-sm text-slate-500 mt-2">
            {search || statusFilter || priorityFilter ? "No tasks match the current filters." : "You haven't assigned any tasks yet. Click 'Assign Task' to get started."}
          </p>
        </div>
      ) : viewMode === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (<TaskCard key={task.id} task={task} />))}
        </div>
      ) : (
        <TaskTable tasks={filteredTasks} />
      )}

      <AssignTaskModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        executives={members}
        onSuccess={refresh}
      />
    </motion.div>
  );
}
