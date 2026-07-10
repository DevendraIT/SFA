const leads = [
  { name: "Rahul Sharma", company: "ABC Pharma", priority: "High" },
  { name: "Sneha Gupta", company: "MedLife", priority: "Medium" },
  { name: "Rakesh Jain", company: "CarePlus", priority: "Low" },
];

export default function AssignedLeads() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">

      <h2 className="text-xl font-bold mb-6">
        Assigned Leads
      </h2>

      <div className="space-y-4">

        {leads.map((lead) => (

          <div
            key={lead.name}
            className="border rounded-xl p-4"
          >

            <h3 className="font-semibold">
              {lead.name}
            </h3>

            <p className="text-gray-500">
              {lead.company}
            </p>

            <span className="text-red-500 font-medium">
              {lead.priority}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}
