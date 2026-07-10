import {
  FiEye,
  FiNavigation,
  FiPhone,
} from "react-icons/fi";

const visits = [
  {
    id: "VIS001",
    customer: "ABC Medical",
    city: "Bhopal",
    time: "10:00 AM",
    status: "Completed",
  },
  {
    id: "VIS002",
    customer: "City Medicos",
    city: "Indore",
    time: "2:30 PM",
    status: "Pending",
  },
];

export default function VisitTable() {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="p-4 text-left">Visit ID</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">City</th>
              <th className="p-4 text-left">Time</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Actions</th>

            </tr>

          </thead>

          <tbody>

            {visits.map((visit) => (

              <tr
                key={visit.id}
                className="border-t hover:bg-slate-50"
              >

                <td className="p-4 font-semibold">{visit.id}</td>

                <td className="p-4">{visit.customer}</td>

                <td className="p-4">{visit.city}</td>

                <td className="p-4">{visit.time}</td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      visit.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {visit.status}
                  </span>

                </td>

                <td className="p-4">

                  <div className="flex justify-center gap-2">

                    <button className="p-2 rounded-lg hover:bg-blue-100 text-blue-600">
                      <FiEye />
                    </button>

                    <button className="p-2 rounded-lg hover:bg-green-100 text-green-600">
                      <FiNavigation />
                    </button>

                    <button className="p-2 rounded-lg hover:bg-purple-100 text-purple-600">
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