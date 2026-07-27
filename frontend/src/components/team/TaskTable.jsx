import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import TaskStatusBadge, { PriorityBadge } from "./TaskStatusBadge";

export default function TaskTable({ tasks = [], loading = false, emptyMessage = "No tasks found." }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-pulse">
        <div className="p-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-slate-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">
        <p className="text-slate-500 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="text-left py-4 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Task
              </th>
              <th className="text-left py-4 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Assigned To
              </th>
              <th className="text-left py-4 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left py-4 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="text-left py-4 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Due Date
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <motion.tr
                key={task.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => navigate(`/team/tasks/${task.id}`)}
                className="border-b border-slate-50 hover:bg-slate-50 transition cursor-pointer"
              >
                <td className="py-4 px-5">
                  <p className="font-semibold text-slate-800 text-sm">
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[200px]">
                      {task.description}
                    </p>
                  )}
                </td>
                <td className="py-4 px-5 text-sm text-slate-600">
                  {task.assignedTo
                    ? `${task.assignedTo.firstName} ${task.assignedTo.lastName}`
                    : "-"}
                </td>
                <td className="py-4 px-5">
                  <TaskStatusBadge status={task.status} />
                </td>
                <td className="py-4 px-5">
                  <PriorityBadge priority={task.priority} />
                </td>
                <td className="py-4 px-5 text-sm text-slate-600">
                  {task.dueDate
                    ? dayjs(task.dueDate).format("MMM D, YYYY")
                    : "-"}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

