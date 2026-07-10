import {
  FiEye,
  FiArrowRight
} from "react-icons/fi";

const orders = [
  {
    id: "#ORD-1001",
    customer: "ABC Pharma",
    amount: "₹15,250",
    status: "Delivered",
    date: "Today",
  },
  {
    id: "#ORD-1002",
    customer: "MedLife",
    amount: "₹9,200",
    status: "Pending",
    date: "Yesterday",
  },
  {
    id: "#ORD-1003",
    customer: "CarePlus",
    amount: "₹21,600",
    status: "Processing",
    date: "2 Days Ago",
  },
];

const statusColor = {
  Delivered: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Processing: "bg-blue-100 text-blue-700",
};

export default function RecentOrders() {
  return (
    <div className="bg-white rounded-2xl shadow-sm">

      <div className="flex justify-between items-center p-6 border-b">

        <div>
          <h2 className="text-xl font-bold">
            Recent Orders
          </h2>

          <p className="text-gray-500 text-sm">
            Latest customer orders
          </p>
        </div>

        <button className="flex items-center gap-2 text-blue-600 font-medium">
          View All
          <FiArrowRight />
        </button>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="p-4 text-left">Order ID</th>

              <th className="p-4 text-left">Customer</th>

              <th className="p-4 text-left">Amount</th>

              <th className="p-4 text-left">Status</th>

              <th className="p-4 text-left">Date</th>

              <th className="p-4 text-center">Action</th>

            </tr>

          </thead>

          <tbody>

            {orders.map((order) => (

              <tr
                key={order.id}
                className="border-t hover:bg-slate-50"
              >

                <td className="p-4 font-semibold">
                  {order.id}
                </td>

                <td className="p-4">
                  {order.customer}
                </td>

                <td className="p-4 font-semibold">
                  {order.amount}
                </td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full text-sm ${statusColor[order.status]}`}
                  >
                    {order.status}
                  </span>

                </td>

                <td className="p-4">
                  {order.date}
                </td>

                <td className="p-4 text-center">

                  <button className="text-blue-600 hover:text-blue-800">
                    <FiEye />
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}