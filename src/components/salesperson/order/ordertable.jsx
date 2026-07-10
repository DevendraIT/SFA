import {
  FiEye,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";

const orders = [
  {
    id: "ORD001",
    customer: "ABC Medical",
    amount: "₹15,000",
    status: "Completed",
    date: "09 Jul 2026",
  },
  {
    id: "ORD002",
    customer: "City Medicos",
    amount: "₹9,500",
    status: "Pending",
    date: "08 Jul 2026",
  },
];

export default function OrderTable() {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="p-4 text-left">Order ID</th>

              <th className="p-4 text-left">Customer</th>

              <th className="p-4 text-left">Amount</th>

              <th className="p-4 text-left">Status</th>

              <th className="p-4 text-left">Date</th>

              <th className="p-4 text-center">Actions</th>

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

                <td className="p-4">
                  {order.amount}
                </td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      order.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>

                </td>

                <td className="p-4">
                  {order.date}
                </td>

                <td className="p-4">

                  <div className="flex justify-center gap-2">

                    <button className="p-2 hover:bg-blue-100 rounded-lg text-blue-600">
                      <FiEye />
                    </button>

                    <button className="p-2 hover:bg-green-100 rounded-lg text-green-600">
                      <FiEdit />
                    </button>

                    <button className="p-2 hover:bg-red-100 rounded-lg text-red-600">
                      <FiTrash2 />
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}