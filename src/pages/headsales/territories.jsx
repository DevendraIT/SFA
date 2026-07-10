import {
  MapPinned,
  Users,
  TrendingUp,
  Target,
  Plus,
  Search,
  Filter,
} from "lucide-react";

export default function Territory() {
  const territories = [
    {
      zone: "North Zone",
      manager: "Rahul Sharma",
      sales: "₹2.45 Cr",
      target: "92%",
      members: 35,
      color: "bg-blue-500",
    },
    {
      zone: "South Zone",
      manager: "Amit Patel",
      sales: "₹2.10 Cr",
      target: "85%",
      members: 30,
      color: "bg-green-500",
    },
    {
      zone: "East Zone",
      manager: "Neha Singh",
      sales: "₹1.95 Cr",
      target: "81%",
      members: 28,
      color: "bg-orange-500",
    },
    {
      zone: "West Zone",
      manager: "Priya Verma",
      sales: "₹2.30 Cr",
      target: "89%",
      members: 33,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold dark:text-white">
            Territory Management
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage sales territories and regional performance.
          </p>

        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2">

          <Plus size={18} />

          Add Territory

        </button>

      </div>

      {/* Search */}

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-5">

        <div className="flex flex-col md:flex-row gap-4">

          <div className="flex items-center flex-1 bg-gray-100 dark:bg-slate-700 rounded-xl px-4">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search Territory..."
              className="w-full bg-transparent outline-none py-3 ml-3 dark:text-white"
            />

          </div>

          <button className="bg-gray-800 text-white px-5 rounded-xl flex items-center gap-2">

            <Filter size={18} />

            Filter

          </button>

        </div>

      </div>

      {/* Territory Cards */}

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

        {territories.map((item) => (

          <div
            key={item.zone}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6"
          >

            <div className="flex justify-between">

              <div>

                <h2 className="font-bold text-xl dark:text-white">
                  {item.zone}
                </h2>

                <p className="text-gray-500 mt-1">
                  {item.manager}
                </p>

              </div>

              <div
                className={`${item.color} h-14 w-14 rounded-xl flex items-center justify-center`}
              >

                <MapPinned color="white" />

              </div>

            </div>

            <div className="mt-6 space-y-4">

              <div className="flex justify-between">

                <span className="text-gray-500">
                  Revenue
                </span>

                <span className="font-semibold">
                  {item.sales}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-500">
                  Members
                </span>

                <span className="font-semibold">
                  {item.members}
                </span>

              </div>

              <div>

                <div className="flex justify-between mb-2">

                  <span className="text-gray-500">
                    Target
                  </span>

                  <span>
                    {item.target}
                  </span>

                </div>

                <div className="bg-gray-200 rounded-full h-3">

                  <div
                    className={`${item.color} h-3 rounded-full`}
                    style={{
                      width: item.target,
                    }}
                  ></div>

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* Territory Performance */}

      <div className="grid lg:grid-cols-2 gap-6">

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">

          <div className="flex items-center gap-3 mb-6">

            <TrendingUp className="text-green-600" />

            <h2 className="text-xl font-bold dark:text-white">
              Territory Performance
            </h2>

          </div>

          <div className="h-80 rounded-xl bg-linear-to-r from-blue-100 to-cyan-100 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">

            Revenue Graph

          </div>

        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">

          <div className="flex items-center gap-3 mb-6">

            <Target className="text-blue-600" />

            <h2 className="text-xl font-bold dark:text-white">
              Zone Target Achievement
            </h2>

          </div>

          <div className="space-y-5">

            {territories.map((item) => (

              <div key={item.zone}>

                <div className="flex justify-between mb-2">

                  <span>{item.zone}</span>

                  <span>{item.target}</span>

                </div>

                <div className="bg-gray-200 rounded-full h-3">

                  <div
                    className={`${item.color} h-3 rounded-full`}
                    style={{
                      width: item.target,
                    }}
                  ></div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>
            {/* Territory Map & Live Tracking */}

      <div className="grid lg:grid-cols-2 gap-6">

        {/* Interactive Map */}

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">

          <h2 className="text-xl font-bold mb-6 dark:text-white">
            Territory Coverage Map
          </h2>

          <div className="h-105 rounded-2xl border-2 border-dashed border-gray-300 dark:border-slate-600 flex flex-col items-center justify-center bg-linear-to-br from-blue-50 to-cyan-50 dark:from-slate-700 dark:to-slate-800">

            <MapPinned
              size={70}
              className="text-blue-600 mb-5"
            />

            <h3 className="text-2xl font-semibold dark:text-white">
              Interactive Google Map
            </h3>

            <p className="text-gray-500 mt-3 text-center max-w-sm">
              Integrate Google Maps API to display live
              territories, sales routes, customer locations
              and GPS tracking.
            </p>

          </div>

        </div>

        {/* GPS Statistics */}

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">

          <h2 className="text-xl font-bold mb-6 dark:text-white">
            GPS Tracking Statistics
          </h2>

          <div className="grid grid-cols-2 gap-5">

            <div className="bg-blue-50 dark:bg-slate-700 rounded-xl p-5">

              <h3 className="text-gray-500">
                Active Employees
              </h3>

              <h2 className="text-3xl font-bold mt-2 text-blue-600">
                128
              </h2>

            </div>

            <div className="bg-green-50 dark:bg-slate-700 rounded-xl p-5">

              <h3 className="text-gray-500">
                Checked In
              </h3>

              <h2 className="text-3xl font-bold mt-2 text-green-600">
                114
              </h2>

            </div>

            <div className="bg-orange-50 dark:bg-slate-700 rounded-xl p-5">

              <h3 className="text-gray-500">
                Active Visits
              </h3>

              <h2 className="text-3xl font-bold mt-2 text-orange-600">
                364
              </h2>

            </div>

            <div className="bg-purple-50 dark:bg-slate-700 rounded-xl p-5">

              <h3 className="text-gray-500">
                Distance Covered
              </h3>

              <h2 className="text-3xl font-bold mt-2 text-purple-600">
                2,480 km
              </h2>

            </div>

          </div>

          <div className="mt-8">

            <h3 className="font-semibold mb-4 dark:text-white">
              Live Team Status
            </h3>

            <div className="space-y-4">

              {[
                ["North Team", "Active", "35 Members"],
                ["South Team", "Active", "30 Members"],
                ["East Team", "Meeting", "28 Members"],
                ["West Team", "Travelling", "33 Members"],
              ].map((item) => (

                <div
                  key={item[0]}
                  className="flex justify-between items-center bg-gray-50 dark:bg-slate-700 rounded-xl p-4"
                >

                  <div>

                    <h3 className="font-semibold dark:text-white">
                      {item[0]}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {item[2]}
                    </p>

                  </div>

                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    {item[1]}
                  </span>

                </div>

              ))}

            </div>

          </div>

        </div>

      </div>

      {/* Territory Table */}

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow overflow-hidden">

        <div className="p-6 border-b dark:border-slate-700">

          <h2 className="text-xl font-bold dark:text-white">
            Territory Details
          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="bg-gray-100 dark:bg-slate-700">

              <tr>

                <th className="px-6 py-4 text-left">
                  Territory
                </th>

                <th className="px-6 py-4 text-left">
                  Manager
                </th>

                <th className="px-6 py-4 text-left">
                  Employees
                </th>

                <th className="px-6 py-4 text-left">
                  Revenue
                </th>

                <th className="px-6 py-4 text-left">
                  Achievement
                </th>

                <th className="px-6 py-4 text-center">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {territories.map((item) => (

                <tr
                  key={item.zone}
                  className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700"
                >

                  <td className="px-6 py-5 font-semibold">
                    {item.zone}
                  </td>

                  <td className="px-6">
                    {item.manager}
                  </td>

                  <td className="px-6">
                    {item.members}
                  </td>

                  <td className="px-6">
                    {item.sales}
                  </td>

                  <td className="px-6">

                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      {item.target}
                    </span>

                  </td>

                  <td className="px-6">

                    <div className="flex justify-center gap-3">

                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                        Edit
                      </button>

                      <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* Pagination */}

      <div className="flex justify-between items-center">

        <p className="text-gray-500">
          Showing 1 - 4 of 24 Territories
        </p>

        <div className="flex gap-2">

          <button className="px-4 py-2 border rounded-lg">
            Previous
          </button>

          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            1
          </button>

          <button className="px-4 py-2 border rounded-lg">
            2
          </button>

          <button className="px-4 py-2 border rounded-lg">
            Next
          </button>

        </div>

      </div>

    </div>
  );
}