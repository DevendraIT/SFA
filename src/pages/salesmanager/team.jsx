import { useState } from "react";
import {
  FaUsers,
  FaUserCheck,
  FaMapMarkerAlt,
  FaCalendarCheck,
  FaSearch,
  FaFilter,
  FaDownload,
  FaPlus,
} from "react-icons/fa";

export default function SMTeam() {

  const [search, setSearch] = useState("");

  const team = [

    {
      id: "EMP001",
      name: "Rahul Sharma",
      designation: "Senior Sales Executive",
      territory: "Indore",
      visits: 12,
      orders: 8,
      target: "90%",
      attendance: "Present",
      gps: "Online",
      status: "Active",
    },

    {
      id: "EMP002",
      name: "Neha Singh",
      designation: "Sales Executive",
      territory: "Bhopal",
      visits: 10,
      orders: 7,
      target: "98%",
      attendance: "Present",
      gps: "Online",
      status: "Excellent",
    },

    {
      id: "EMP003",
      name: "Amit Verma",
      designation: "Sales Executive",
      territory: "Ujjain",
      visits: 6,
      orders: 4,
      target: "68%",
      attendance: "Present",
      gps: "Offline",
      status: "Needs Attention",
    },

    {
      id: "EMP004",
      name: "Priya Jain",
      designation: "Key Account Executive",
      territory: "Dewas",
      visits: 15,
      orders: 11,
      target: "102%",
      attendance: "Leave",
      gps: "Offline",
      status: "Top Performer",
    },

  ];

  const filteredTeam = team.filter(
    (employee) =>
      employee.name.toLowerCase().includes(search.toLowerCase()) ||
      employee.territory.toLowerCase().includes(search.toLowerCase()) ||
      employee.designation.toLowerCase().includes(search.toLowerCase())
  );

  return (

<div className="space-y-8">

{/* Header */}

<div className="flex flex-col lg:flex-row justify-between lg:items-center">

<div>

<h1 className="text-3xl font-bold">

Team Management

</h1>

<p className="text-gray-500 mt-2">

Manage your sales team, monitor attendance, GPS tracking and productivity.

</p>

</div>

<div className="flex gap-3 mt-5 lg:mt-0">

<button className="border rounded-xl px-5 py-3 flex items-center gap-2 hover:bg-gray-100">

<FaDownload />

Export

</button>

<button className="bg-blue-600 text-white rounded-xl px-5 py-3 flex items-center gap-2 hover:bg-blue-700">

<FaPlus />

Add Member

</button>

</div>

</div>

{/* KPI Cards */}

<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

<div className="bg-white rounded-2xl border shadow-sm p-6">

<div className="flex justify-between">

<div>

<p className="text-gray-500">

Total Members

</p>

<h2 className="text-3xl font-bold mt-2">

48

</h2>

</div>

<div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">

<FaUsers className="text-blue-600 text-2xl"/>

</div>

</div>

</div>

<div className="bg-white rounded-2xl border shadow-sm p-6">

<div className="flex justify-between">

<div>

<p className="text-gray-500">

Present Today

</p>

<h2 className="text-3xl font-bold mt-2">

43

</h2>

</div>

<div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">

<FaUserCheck className="text-green-600 text-2xl"/>

</div>

</div>

</div>

<div className="bg-white rounded-2xl border shadow-sm p-6">

<div className="flex justify-between">

<div>

<p className="text-gray-500">

On Field

</p>

<h2 className="text-3xl font-bold mt-2">

39

</h2>

</div>

<div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center">

<FaMapMarkerAlt className="text-orange-600 text-2xl"/>

</div>

</div>

</div>

<div className="bg-white rounded-2xl border shadow-sm p-6">

<div className="flex justify-between">

<div>

<p className="text-gray-500">

On Leave

</p>

<h2 className="text-3xl font-bold mt-2">

5

</h2>

</div>

<div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center">

<FaCalendarCheck className="text-purple-600 text-2xl"/>

</div>

</div>

</div>

</div>

{/* Search & Filters */}

<div className="bg-white rounded-2xl border shadow-sm p-6">

<div className="flex flex-col lg:flex-row justify-between gap-4">

<div className="relative lg:w-96">

<FaSearch className="absolute left-4 top-4 text-gray-400"/>

<input
type="text"
placeholder="Search employee..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="w-full border rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
/>

</div>

<div className="flex gap-3">

<select className="border rounded-xl px-5 py-3">

<option>All Territories</option>
<option>Indore</option>
<option>Bhopal</option>
<option>Ujjain</option>
<option>Dewas</option>

</select>

<select className="border rounded-xl px-5 py-3">

<option>Attendance</option>
<option>Present</option>
<option>Leave</option>

</select>

<button className="border rounded-xl px-5 py-3 flex items-center gap-2">

<FaFilter/>

Filters

</button>

</div>

</div>

</div>

{/* Team Table */}

<div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

<div className="px-6 py-5 border-b">

<h2 className="text-xl font-semibold">

Sales Team Directory

</h2>

</div>

<div className="overflow-x-auto">

<table className="min-w-full">

<thead className="bg-gray-100">

<tr>

<th className="px-6 py-4 text-left">Employee</th>

<th className="px-6 py-4 text-left">Territory</th>

<th className="px-6 py-4 text-left">Today's Visits</th>

<th className="px-6 py-4 text-left">Orders</th>

<th className="px-6 py-4 text-left">Target</th>

<th className="px-6 py-4 text-left">Attendance</th>

<th className="px-6 py-4 text-left">GPS</th>

<th className="px-6 py-4 text-left">Status</th>

<th className="px-6 py-4 text-center">Action</th>

</tr>

</thead>

<tbody>
                {filteredTeam.map((employee, index) => (

              <tr
                key={employee.id}
                className="border-b hover:bg-gray-50 transition-all duration-200"
              >

                {/* Employee */}

                <td className="px-6 py-5">

                  <div className="flex items-center gap-4">

                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">

                      {employee.name.charAt(0)}

                    </div>

                    <div>

                      <h3 className="font-semibold">

                        {employee.name}

                      </h3>

                      <p className="text-sm text-gray-500">

                        {employee.designation}

                      </p>

                      <p className="text-xs text-gray-400">

                        {employee.id}

                      </p>

                    </div>

                  </div>

                </td>

                {/* Territory */}

                <td className="px-6 py-5">

                  {employee.territory}

                </td>

                {/* Visits */}

                <td className="px-6 py-5 font-semibold">

                  {employee.visits}

                </td>

                {/* Orders */}

                <td className="px-6 py-5 font-semibold text-blue-600">

                  {employee.orders}

                </td>

                {/* Target */}

                <td className="px-6 py-5">

                  <div className="w-32">

                    <div className="flex justify-between text-sm mb-1">

                      <span>{employee.target}</span>

                    </div>

                    <div className="h-2 bg-gray-200 rounded-full">

                      <div
                        className={`h-2 rounded-full ${
                          parseInt(employee.target) >= 100
                            ? "bg-green-500"
                            : parseInt(employee.target) >= 80
                            ? "bg-blue-500"
                            : "bg-orange-500"
                        }`}
                        style={{
                          width: employee.target,
                        }}
                      />

                    </div>

                  </div>

                </td>

                {/* Attendance */}

                <td className="px-6 py-5">

                  <span
                    className={`px-3 py-2 rounded-full text-xs font-semibold ${
                      employee.attendance === "Present"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >

                    {employee.attendance}

                  </span>

                </td>

                {/* GPS */}

                <td className="px-6 py-5">

                  <div className="flex items-center gap-2">

                    <span
                      className={`w-3 h-3 rounded-full ${
                        employee.gps === "Online"
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                    />

                    <span>

                      {employee.gps}

                    </span>

                  </div>

                </td>

                {/* Status */}

                <td className="px-6 py-5">

                  <span
                    className={`px-3 py-2 rounded-full text-xs font-semibold ${
                      employee.status === "Top Performer"
                        ? "bg-purple-100 text-purple-700"
                        : employee.status === "Excellent"
                        ? "bg-blue-100 text-blue-700"
                        : employee.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >

                    {employee.status}

                  </span>

                </td>

                {/* Actions */}

                <td className="px-6 py-5">

                  <div className="flex justify-center gap-2">

                    <button className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">

                      View

                    </button>

                    <button className="px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100">

                      Edit

                    </button>

                    <button className="px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100">

                      Assign

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

      <div className="bg-white rounded-2xl border shadow-sm p-5 flex flex-col lg:flex-row justify-between items-center">

        <p className="text-sm text-gray-500">

          Showing 1 to {filteredTeam.length} of {team.length} team members

        </p>

        <div className="flex gap-2 mt-4 lg:mt-0">

          <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">

            Previous

          </button>

          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">

            1

          </button>

          <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">

            2

          </button>

          <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">

            Next

          </button>

        </div>

      </div>

      {/* Bottom Analytics */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Live GPS */}

        <div className="bg-white rounded-2xl border shadow-sm p-6">

          <h2 className="text-xl font-semibold mb-6">

            Live Team Status

          </h2>

          <div className="space-y-5">

            <div className="flex justify-between">

              <span>Online Employees</span>

              <span className="font-bold text-green-600">

                39

              </span>

            </div>

            <div className="flex justify-between">

              <span>Offline Employees</span>

              <span className="font-bold text-red-600">

                9

              </span>

            </div>

            <div className="flex justify-between">

              <span>Average Visits</span>

              <span className="font-bold">

                11 / Day

              </span>

            </div>

            <div className="flex justify-between">

              <span>Attendance</span>

              <span className="font-bold text-blue-600">

                91%

              </span>

            </div>

          </div>

        </div>

        {/* Productivity */}

        <div className="bg-white rounded-2xl border shadow-sm p-6">

          <h2 className="text-xl font-semibold mb-6">

            Team Productivity

          </h2>

          <div className="space-y-5">

            {[
              { label: "Orders", value: 92, color: "bg-green-500" },
              { label: "Visits", value: 84, color: "bg-blue-500" },
              { label: "Attendance", value: 95, color: "bg-purple-500" },
              { label: "Target Achievement", value: 87, color: "bg-orange-500" },
            ].map((item, index) => (

              <div key={index}>

                <div className="flex justify-between mb-2">

                  <span>{item.label}</span>

                  <span className="font-semibold">

                    {item.value}%

                  </span>

                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">

                  <div
                    className={`${item.color} h-3 rounded-full`}
                    style={{ width: `${item.value}%` }}
                  />

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

      {/* AI Recommendation */}

      <div className="bg-linear-to-r from-indigo-600 to-blue-700 rounded-2xl shadow-sm p-6 text-white">

        <h2 className="text-2xl font-semibold mb-6">

          AI Manager Recommendations

        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white/10 rounded-xl p-5">

            <h3 className="font-semibold mb-3">

              Best Performer

            </h3>

            <p>

              Priya Jain exceeded the monthly target by <strong>102%</strong>.

            </p>

          </div>

          <div className="bg-white/10 rounded-xl p-5">

            <h3 className="font-semibold mb-3">

              Attention Required

            </h3>

            <p>

              Amit Verma's target achievement is below 70%. Assign additional support.

            </p>

          </div>

          <div className="bg-white/10 rounded-xl p-5">

            <h3 className="font-semibold mb-3">

              Recommendation

            </h3>

            <p>

              Increase customer visits in the Ujjain territory to improve quarterly revenue.

            </p>

          </div>

        </div>

      </div>

    </div>

  );

}