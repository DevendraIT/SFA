import { Bell } from "lucide-react";

export default function NotificationList({
  notifications = [],
  emptyMessage = "No notifications yet.",
}) {
  if (!notifications.length) {
    return (
      <div className="py-10 text-center text-slate-500 text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((item, index) => {
        const dotColor =
          item.type === "warning"
            ? "bg-amber-500"
            : item.type === "success"
            ? "bg-emerald-500"
            : item.type === "error"
            ? "bg-red-500"
            : "bg-blue-500";

        return (
          <div
            key={item.id || index}
            className="rounded-xl border border-slate-100 p-4 hover:bg-slate-50 transition cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className={`h-2.5 w-2.5 rounded-full mt-1.5 ${dotColor} flex-shrink-0`} />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-slate-800 text-sm">
                  {item.title}
                </h4>
                {item.message && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    {item.message}
                  </p>
                )}
                {item.time && (
                  <p className="text-xs text-slate-400 mt-1.5">{item.time}</p>
                )}
              </div>
              {item.unread && (
                <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export { NotificationList };

