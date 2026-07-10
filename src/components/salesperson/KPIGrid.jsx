import {
  FiTrendingUp,
  FiUsers,
  FiShoppingCart,
  FiTarget,
  FiMapPin,
  FiClipboard,
} from "react-icons/fi";

import KPIWidget from "./KPIWidget";

export default function KPIGrid() {

  const cards = [
    {
      title: "Today's Sales",
      value: "₹35,250",
      icon: <FiTrendingUp size={24} />,
      color: "bg-green-500",
    },
    {
      title: "Today's Visits",
      value: "12 / 15",
      icon: <FiMapPin size={24} />,
      color: "bg-blue-500",
    },
    {
      title: "Assigned Leads",
      value: "18",
      icon: <FiUsers size={24} />,
      color: "bg-purple-500",
    },
    {
      title: "Pending Orders",
      value: "7",
      icon: <FiShoppingCart size={24} />,
      color: "bg-orange-500",
    },
    {
      title: "Conversion",
      value: "72%",
      icon: <FiTarget size={24} />,
      color: "bg-pink-500",
    },
    {
      title: "Today's Tasks",
      value: "9",
      icon: <FiClipboard size={24} />,
      color: "bg-cyan-500",
    },
  ];

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

      {cards.map((card) => (
        <KPIWidget key={card.title} {...card} />
      ))}

    </div>
  );
}