import { motion } from "framer-motion";

const attendanceStatusConfig = {
  PRESENT: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Present" },
  ABSENT: { bg: "bg-red-100", text: "text-red-700", label: "Absent" },
  LEAVE: { bg: "bg-amber-100", text: "text-amber-700", label: "On Leave" },
  HALFDAY: { bg: "bg-blue-100", text: "text-blue-700", label: "Half Day" },
};

const visitStatusConfig = {
  PLANNED: { bg: "bg-slate-100", text: "text-slate-700", label: "Planned" },
  IN_PROGRESS: { bg: "bg-blue-100", text: "text-blue-700", label: "In Progress" },
  COMPLETED: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Completed" },
  CANCELLED: { bg: "bg-red-100", text: "text-red-700", label: "Cancelled" },
};

const expenseStatusConfig = {
  PENDING: { bg: "bg-amber-100", text: "text-amber-700", label: "Pending" },
  APPROVED: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Approved" },
  REJECTED: { bg: "bg-red-100", text: "text-red-700", label: "Rejected" },
};

const darStatusConfig = {
  DRAFT: { bg: "bg-slate-100", text: "text-slate-700", label: "Draft" },
  SUBMITTED: { bg: "bg-blue-100", text: "text-blue-700", label: "Submitted" },
  APPROVED: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Approved" },
};

const taskStatusConfig = {
  PENDING: { bg: "bg-amber-100", text: "text-amber-700", label: "Pending" },
  IN_PROGRESS: { bg: "bg-blue-100", text: "text-blue-700", label: "In Progress" },
  COMPLETED: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Completed" },
  CANCELLED: { bg: "bg-red-100", text: "text-red-700", label: "Cancelled" },
};

const beatPlanStatusConfig = {
  DRAFT: { bg: "bg-slate-100", text: "text-slate-700", label: "Draft" },
  APPROVED: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Approved" },
};

const priorityConfig = {
  LOW: { bg: "bg-slate-100", text: "text-slate-600", label: "Low" },
  MEDIUM: { bg: "bg-blue-100", text: "text-blue-700", label: "Medium" },
  HIGH: { bg: "bg-orange-100", text: "text-orange-700", label: "High" },
  URGENT: { bg: "bg-red-100", text: "text-red-700", label: "Urgent" },
};

const configMap = {
  attendance: attendanceStatusConfig,
  visit: visitStatusConfig,
  expense: expenseStatusConfig,
  dar: darStatusConfig,
  task: taskStatusConfig,
  beatPlan: beatPlanStatusConfig,
  priority: priorityConfig,
};

export default function StatusBadge({ status, type = "task", size = "sm", className = "" }) {
  const config = configMap[type]?.[status] || {
    bg: "bg-slate-100",
    text: "text-slate-600",
    label: status || "Unknown",
  };

  const sizeClasses = size === "lg" ? "px-3 py-1.5 text-sm" : "px-2.5 py-1 text-xs";

  return (
    <motion.span
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className={`inline-flex items-center rounded-full font-semibold ${config.bg} ${config.text} ${sizeClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${config.bg.replace("bg-", "bg-")}`} style={{ backgroundColor: "currentColor" }} />
      {config.label}
    </motion.span>
  );
}

export function PriorityBadge({ priority, className = "" }) {
  return <StatusBadge status={priority} type="priority" className={className} />;
}

