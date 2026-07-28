const statusConfig = {
  PENDING: { bg: "bg-amber-100", text: "text-amber-700", label: "Pending" },
  ASSIGNED: { bg: "bg-sky-100", text: "text-sky-700", label: "Assigned" },
  ACCEPTED: { bg: "bg-indigo-100", text: "text-indigo-700", label: "Accepted" },
  IN_PROGRESS: { bg: "bg-blue-100", text: "text-blue-700", label: "In Progress" },
  NAVIGATING: { bg: "bg-cyan-100", text: "text-cyan-700", label: "Navigating" },
  ARRIVED: { bg: "bg-purple-100", text: "text-purple-700", label: "Arrived" },
  CHECKED_IN: { bg: "bg-teal-100", text: "text-teal-700", label: "Checked In" },
  DELIVERY_IN_PROGRESS: { bg: "bg-blue-100", text: "text-blue-800", label: "Delivery in Progress" },
  PAYMENT_COLLECTED: { bg: "bg-emerald-100", text: "text-emerald-800", label: "Payment Collected" },
  PHOTO_UPLOADED: { bg: "bg-pink-100", text: "text-pink-700", label: "Photo Uploaded" },
  VISIT_NOTES_COMPLETED: { bg: "bg-violet-100", text: "text-violet-700", label: "Visit Notes Added" },
  CHECKED_OUT: { bg: "bg-orange-100", text: "text-orange-700", label: "Checked Out" },
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

