import {
  FiShoppingCart,
  FiUserPlus,
  FiUsers,
  FiMapPin,
  FiDollarSign,
  FiTarget,
} from "react-icons/fi";

const actions = [
  { title: "Create Order", icon: <FiShoppingCart />, color: "bg-blue-600" },
  { title: "Add Customer", icon: <FiUsers />, color: "bg-green-600" },
  { title: "Add Lead", icon: <FiUserPlus />, color: "bg-purple-600" },
  { title: "Start Visit", icon: <FiMapPin />, color: "bg-orange-500" },
  { title: "Expense", icon: <FiDollarSign />, color: "bg-pink-600" },
  { title: "Target", icon: <FiTarget />, color: "bg-cyan-600" },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5">
      {actions.map((action) => (
        <button
          key={action.title}
          className={`${action.color} text-white rounded-2xl p-6 hover:scale-105 transition`}
        >
          <div className="text-3xl mb-3 flex justify-center">
            {action.icon}
          </div>

          <p className="font-semibold">
            {action.title}
          </p>
        </button>
      ))}
    </div>
  );
}