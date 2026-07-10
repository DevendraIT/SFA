import {
  FiPackage,
  FiBox,
  FiAlertTriangle,
  FiTrendingUp,
} from "react-icons/fi";

const stats = [
  {
    title: "Total Products",
    value: "450",
    icon: <FiPackage size={28} />,
    color: "bg-blue-500",
  },
  {
    title: "In Stock",
    value: "410",
    icon: <FiBox size={28} />,
    color: "bg-green-500",
  },
  {
    title: "Low Stock",
    value: "25",
    icon: <FiAlertTriangle size={28} />,
    color: "bg-orange-500",
  },
  {
    title: "Top Selling",
    value: "15",
    icon: <FiTrendingUp size={28} />,
    color: "bg-purple-500",
  },
];

export default function ProductStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((item) => (
        <div
          key={item.title}
          className="bg-white rounded-2xl shadow-sm p-6"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">{item.title}</p>
              <h2 className="text-3xl font-bold mt-3">{item.value}</h2>
            </div>

            <div className={`${item.color} text-white p-4 rounded-xl`}>
              {item.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}