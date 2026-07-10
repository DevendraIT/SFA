import {
  FiEye,
  FiEdit,
  FiPhone,
  FiShoppingCart,
  FiMapPin,
} from "react-icons/fi";

const customers = [
  {
    id: "CUS001",
    name: "ABC Medical Store",
    owner: "Rahul Sharma",
    phone: "9876543210",
    city: "Bhopal",
    state: "Madhya Pradesh",
    outstanding: "₹12,500",
    lastVisit: "Today",
    status: "Active",
  },
  {
    id: "CUS002",
    name: "City Medicos",
    owner: "Neha Jain",
    phone: "9876501234",
    city: "Indore",
    state: "Madhya Pradesh",
    outstanding: "₹8,900",
    lastVisit: "Yesterday",
    status: "Pending",
  },
];

export default function CustomerTable() {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="p-4 text-left">Customer</th>

              <th className="p-4 text-left">Owner</th>

              <th className="p-4 text-left">Phone</th>

              <th className="p-4 text-left">City</th>

              <th className="p-4 text-left">Outstanding</th>

              <th className="p-4 text-left">Last Visit</th>

              <th className="p-4 text-left">Status</th>

              <th className="p-4 text-center">Actions</th>

            </tr>

          </thead>

          <tbody>

            {customers.map((customer) => (

              <tr
                key={customer.id}
                className="border-t hover:bg-slate-50 transition"
              >

                <td className="p-4">
                  <div>
                    <h3 className="font-semibold">{customer.name}</h3>
                    <p className="text-sm text-gray-500">{customer.id}</p>
                  </div>
                </td>

                <td className="p-4">{customer.owner}</td>

                <td className="p-4">{customer.phone}</td>

                <td className="p-4">
                  {customer.city}, {customer.state}
                </td>

                <td className="p-4 font-semibold">
                  {customer.outstanding}
                </td>

                <td className="p-4">{customer.lastVisit}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      customer.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {customer.status}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex justify-center gap-2">

                    <button className="p-2 rounded-lg hover:bg-blue-100 text-blue-600">
                      <FiEye />
                    </button>

                    <button className="p-2 rounded-lg hover:bg-green-100 text-green-600">
                      <FiEdit />
                    </button>

                    <button className="p-2 rounded-lg hover:bg-orange-100 text-orange-600">
                      <FiMapPin />
                    </button>

                    <button className="p-2 rounded-lg hover:bg-purple-100 text-purple-600">
                      <FiShoppingCart />
                    </button>

                    <button className="p-2 rounded-lg hover:bg-red-100 text-red-600">
                      <FiPhone />
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