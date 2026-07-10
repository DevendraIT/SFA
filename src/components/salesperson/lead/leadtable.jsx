import {
  FiEye,
  FiEdit,
  FiUserPlus,
  FiTrash2,
} from "react-icons/fi";

const leads = [
  {
    id: "LD001",
    name: "Rahul Sharma",
    company: "ABC Pharma",
    phone: "9876543210",
    source: "Website",
    priority: "High",
    status: "Qualified",
  },
  {
    id: "LD002",
    name: "Neha Gupta",
    company: "City Medicos",
    phone: "9876501234",
    source: "Referral",
    priority: "Medium",
    status: "Contacted",
  },
];

const statusColor = {
  Qualified: "bg-green-100 text-green-700",
  Contacted: "bg-blue-100 text-blue-700",
  New: "bg-yellow-100 text-yellow-700",
};

export default function LeadTable() {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>
              <th className="p-4 text-left">Lead ID</th>
              <th className="p-4 text-left">Lead Name</th>
              <th className="p-4 text-left">Company</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Source</th>
              <th className="p-4 text-left">Priority</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>

          </thead>

          <tbody>

            {leads.map((lead) => (

              <tr key={lead.id} className="border-t hover:bg-slate-50">

                <td className="p-4 font-semibold">{lead.id}</td>
                <td className="p-4">{lead.name}</td>
                <td className="p-4">{lead.company}</td>
                <td className="p-4">{lead.phone}</td>
                <td className="p-4">{lead.source}</td>

                <td className="p-4">

                  <span className={`px-3 py-1 rounded-full text-sm ${
                    lead.priority === "High"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {lead.priority}
                  </span>

                </td>

                <td className="p-4">

                  <span className={`px-3 py-1 rounded-full text-sm ${statusColor[lead.status]}`}>
                    {lead.status}
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

                    <button className="p-2 rounded-lg hover:bg-purple-100 text-purple-600">
                      <FiUserPlus />
                    </button>

                    <button className="p-2 rounded-lg hover:bg-red-100 text-red-600">
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