import {
  FiUsers,
  FiPhoneCall,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

const stats = [
  {
    title: "Total Leads",
    value: "245",
    icon: <FiUsers size={28} />,
    color: "bg-blue-500",
  },
  {
    title: "Contacted",
    value: "150",
    icon: <FiPhoneCall size={28} />,
    color: "bg-orange-500",
  },
  {
    title: "Converted",
    value: "72",
    icon: <FiCheckCircle size={28} />,
    color: "bg-green-500",
  },
  {
    title: "Lost",
    value: "23",
    icon: <FiXCircle size={28} />,
    color: "bg-red-500",
  },
];

export default function LeadStats() {
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

            <div className={`${item.color} w-14 h-14 rounded-xl flex justify-center items-center text-white`}>
              {item.icon}
            </div>

          </div>

        </div>

      ))}

    </div>
  );
}