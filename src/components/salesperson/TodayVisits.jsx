const visits = [
  {
    customer: "ABC Medical",
    time: "09:30 AM",
    status: "Completed",
  },
  {
    customer: "Sharma Pharma",
    time: "11:15 AM",
    status: "Pending",
  },
  {
    customer: "City Medicos",
    time: "02:00 PM",
    status: "Upcoming",
  },
];

export default function TodayVisits() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">

      <h2 className="text-xl font-bold mb-6">
        Today's Visits
      </h2>

      <div className="space-y-4">

        {visits.map((visit) => (

          <div
            key={visit.customer}
            className="border rounded-xl p-4 flex justify-between items-center"
          >

            <div>

              <h3 className="font-semibold">
                {visit.customer}
              </h3>

              <p className="text-gray-500">
                {visit.time}
              </p>

            </div>

            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
              {visit.status}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}