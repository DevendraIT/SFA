import { Search, X } from "lucide-react";

const TASK_STATUSES = ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"];

export default function TaskFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  executiveId,
  onExecutiveChange,
  executives = [],
}) {
  const hasFilters = search || status || priority || executiveId;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search || ""}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Status Filter */}
        <select
          value={status || ""}
          onChange={(e) => onStatusChange(e.target.value || null)}
          className="px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        >
          <option value="">All Statuses</option>
          {TASK_STATUSES.map((s) => (
            <option key={s} value={s}>{s.replace("_", " ")}</option>
          ))}
        </select>

        {/* Priority Filter */}
        <select
          value={priority || ""}
          onChange={(e) => onPriorityChange(e.target.value || null)}
          className="px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        >
          <option value="">All Priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        {/* Executive Filter */}
        {executives.length > 0 && (
          <select
            value={executiveId || ""}
            onChange={(e) => onExecutiveChange(e.target.value || null)}
            className="px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="">All Executives</option>
            {executives.map((exec) => (
              <option key={exec.id} value={exec.id}>
                {exec.firstName} {exec.lastName}
              </option>
            ))}
          </select>
        )}

        {/* Clear Filters */}
        {hasFilters && (
          <button
            onClick={() => {
              onSearchChange("");
              onStatusChange(null);
              onPriorityChange(null);
              if (onExecutiveChange) onExecutiveChange(null);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 transition text-sm"
          >
            <X size={16} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

