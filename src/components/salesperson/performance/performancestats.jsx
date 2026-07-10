import {
  FiTrendingUp,
  FiTarget,
  FiShoppingBag,
  FiUsers,
} from "react-icons/fi";

const stats = [
  {
    title: "Monthly Sales",
    value: "₹5.25L",
    growth: "+18%",
    color: "bg-blue-500",
    icon: <FiTrendingUp size={28} />,
  },
  {
    title: "Target",
    value: "78%",
    growth: "+8%",
    color: "bg-green-500",
    icon: <FiTarget size={28} />,
  },
  {
    title: "Orders",
    value: "152",
    growth: "+21%",
    color: "bg-orange-500",
    icon: <FiShoppingBag size={28} />,
  },
  {
    title: "Customers",
    value: "89",
    growth: "+12%",
    color: "bg-purple-500",
    icon: <FiUsers size={28} />,
  },
];

export default function PerformanceStats() {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((item) => (
        <div key={item.title} className="bg-white rounded-2xl shadow-sm p-6">

          <div className="flex justify-between">

            <div>

              <p className="text-gray-500">{item.title}</p>

              <h2 className="text-3xl font-bold mt-3">{item.value}</h2>

              <p className="text-green-600 mt-2">{item.growth}</p>

            </div>

            <div className={`${item.color} w-14 h-14 rounded-xl flex items-center justify-center text-white`}>
              {item.icon}
            </div>

          </div>

        </div>
      ))}
    </div>
  );
}