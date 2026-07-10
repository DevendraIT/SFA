export default function SessionManagement() {

  const sessions = [
    {
      device: "Windows Chrome",
      location: "Bhopal",
      status: "Active"
    },
    {
      device: "Android Mobile",
      location: "Delhi",
      status: "Inactive"
    }
  ];

  return (
    <div className="bg-white p-8 rounded-xl shadow">

      <h1 className="text-3xl font-bold mb-6">
        Session Management
      </h1>

      <table className="w-full">

        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Device</th>
            <th>Location</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {sessions.map((s, i) => (
            <tr key={i} className="border-t">
              <td className="p-3">{s.device}</td>
              <td>{s.location}</td>
              <td>{s.status}</td>
              <td>
                <button className="bg-red-500 text-white px-3 py-1 rounded">
                  Logout
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}