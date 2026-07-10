import {
  FiMapPin,
  FiCheckCircle,
  FiClock,
  FiNavigation,
} from "react-icons/fi";

const stats = [
  {
    title: "Today's Visits",
    value: "15",
    color: "bg-blue-500",
    icon: <FiMapPin size={26} />,
  },
  {
    title: "Completed",
    value: "9",
    color: "bg-green-500",
    icon: <FiCheckCircle size={26} />,
  },
  {
    title: "Pending",
    value: "6",
    color: "bg-orange-500",
    icon: <FiClock size={26} />,
  },
  {
    title: "Distance",
    value: "28 km",
    color: "bg-purple-500",
    icon: <FiNavigation size={26} />,
  },
];

export default function VisitStats() {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

      {stats.map((item) => (

        <div
          key={item.title}
          className="bg-white rounded-2xl shadow-sm p-6"
        >

          <div className="flex justify-between">

            <div>

              <p className="text-gray-500">
                {item.title}
              </p>

              <h2 className="text-3xl font-bold mt-3">
                {item.value}
              </h2>

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