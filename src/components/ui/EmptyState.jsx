import { Inbox } from "lucide-react";
import Button from "./Button.jsx";

export default function EmptyState({ icon: Icon = Inbox, title = "No data yet", description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-700 dark:text-white">{title}</h3>
      {description && <p className="text-sm text-slate-500 mt-2 max-w-sm">{description}</p>}
      {actionLabel && onAction && (
        <Button className="mt-6" onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
