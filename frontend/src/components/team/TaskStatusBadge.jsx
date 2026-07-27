const statusConfig = {
  PENDING: { bg: "bg-amber-100", text: "text-amber-700", label: "Pending" },
  IN_PROGRESS: { bg: "bg-blue-100", text: "text-blue-700", label: "In Progress" },
  COMPLETED: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Completed" },
  CANCELLED: { bg: "bg-red-100", text: "text-red-700", label: "Cancelled" },
};

export default function TaskStatusBadge({ status, className = "" }) {
  const config = statusConfig[status] || {
    bg: "bg-slate-100",
    text: "text-slate-600",
    label: status || "Unknown",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${config.bg.replace(
          "bg-",
          "bg-"
        )}`}
      />
      {config.label}
    </span>
  );
}

export const priorityConfig = {
  LOW: { bg: "bg-slate-100", text: "text-slate-600", label: "Low" },
  MEDIUM: { bg: "bg-blue-100", text: "text-blue-700", label: "Medium" },
  HIGH: { bg: "bg-orange-100", text: "text-orange-700", label: "High" },
  URGENT: { bg: "bg-red-100", text: "text-red-700", label: "Urgent" },
};

export function PriorityBadge({ priority, className = "" }) {
  const config = priorityConfig[priority] || {
    bg: "bg-slate-100",
    text: "text-slate-600",
    label: priority || "Unknown",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text} ${className}`}
    >
      {config.label}
    </span>
  );
}

