import {
  FiBell,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
} from "react-icons/fi";

const notifications = [
  {
    title: "Target Achieved",
    message: "Congratulations! You achieved 75% of your monthly target.",
    icon: <FiCheckCircle className="text-green-600" />,
    time: "5 min ago",
  },
  {
    title: "New Lead Assigned",
    message: "ABC Medical has been assigned to you.",
    icon: <FiBell className="text-blue-600" />,
    time: "30 min ago",
  },
  {
    title: "Visit Reminder",
    message: "Customer meeting at 2:00 PM.",
    icon: <FiClock className="text-orange-500" />,
    time: "1 hour ago",
  },
  {
    title: "Pending Expense",
    message: "Please submit yesterday's travel expense.",
    icon: <FiAlertCircle className="text-red-500" />,
    time: "Yesterday",
  },
];

export default function NotificationsPanel() {
  return (
    <div className="bg-white rounded-2xl shadow-sm">

      <div className="p-6 border-b">

        <h2 className="text-xl font-bold">
          Notifications
        </h2>

      </div>

      <div>

        {notifications.map((item, index) => (

          <div
            key={index}
            className="flex gap-4 p-5 border-b hover:bg-slate-50"
          >

            <div className="text-2xl">
              {item.icon}
            </div>

            <div>

              <h3 className="font-semibold">
                {item.title}
              </h3>

              <p className="text-gray-500 text-sm mt-1">
                {item.message}
              </p>

              <p className="text-xs text-gray-400 mt-2">
                {item.time}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}