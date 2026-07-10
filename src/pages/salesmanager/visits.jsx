import { useState } from "react";
import {
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaCalendarDay,
  FaSearch,
  FaFilter,
  FaDownload,
  FaPlus,
} from "react-icons/fa";

export default function SMVisits() {

  const [search, setSearch] = useState("");

  const visits = [

    {
      customer: "ABC Traders",
      salesperson: "Rahul Sharma",
      territory: "Indore",
      date: "07 Jul 2026",
      checkIn: "09:15 AM",
      checkOut: "10:05 AM",
      duration: "50 mins",
      status: "Completed",
    },

    {
      customer: "Global Pharma",
      salesperson: "Neha Singh",
      territory: "Bhopal",
      date: "07 Jul 2026",
      checkIn: "11:20 AM",
      checkOut: "--",
      duration: "--",
      status: "In Progress",
    },

    {
      customer: "Sai Distributor",
      salesperson: "Amit Verma",
      territory: "Ujjain",
      date: "08 Jul 2026",
      checkIn: "--",
      checkOut: "--",
      duration: "--",
      status: "Scheduled",
    },

    {
      customer: "Modern Retail",
      salesperson: "Priya Jain",
      territory: "Dewas",
      date: "06 Jul 2026",
      checkIn: "10:00 AM",
      checkOut: "11:10 AM",
      duration: "1 hr 10 mins",
      status: "Completed",
    },

  ];

  const filteredVisits = visits.filter((visit) =>
    visit.customer.toLowerCase().includes(search.toLowerCase()) ||
    visit.salesperson.toLowerCase().includes(search.toLowerCase()) ||
    visit.territory.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col lg:flex-row justify-between lg:items-center">

        <div>

          <h1 className="text-3xl font-bold">

            Visit Management

          </h1>

          <p className="text-gray-500 mt-2">

            Monitor field visits, GPS tracking and customer meetings.

          </p>

        </div>

        <div className="flex gap-3 mt-5 lg:mt-0">

          <button className="border rounded-xl px-5 py-3 flex items-center gap-2 hover:bg-gray-100">

            <FaDownload />

            Export

          </button>

          <button className="bg-blue-600 text-white rounded-xl px-6 py-3 flex items-center gap-2 hover:bg-blue-700">

            <FaPlus />

            Schedule Visit

          </button>

        </div>

      </div>

      {/* KPI Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-white rounded-2xl border shadow-sm p-6">

          <div className="flex justify-between">

            <div>

              <p className="text-gray-500">Today's Visits</p>

              <h2 className="text-3xl font-bold mt-2">48</h2>

            </div>

            <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">

              <FaCalendarDay className="text-blue-600 text-2xl"/>

            </div>

          </div>

        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6">

          <div className="flex justify-between">

            <div>

              <p className="text-gray-500">Completed</p>

              <h2 className="text-3xl font-bold mt-2">36</h2>

            </div>

            <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">

              <FaCheckCircle className="text-green-600 text-2xl"/>

            </div>

          </div>

        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6">

          <div className="flex justify-between">

            <div>

              <p className="text-gray-500">In Progress</p>

              <h2 className="text-3xl font-bold mt-2">8</h2>

            </div>

            <div className="w-14 h-14 rounded-xl bg-yellow-100 flex items-center justify-center">

              <FaClock className="text-yellow-600 text-2xl"/>

            </div>

          </div>

        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6">

          <div className="flex justify-between">

            <div>

              <p className="text-gray-500">Scheduled</p>

              <h2 className="text-3xl font-bold mt-2">12</h2>

            </div>

            <div className="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center">

              <FaMapMarkerAlt className="text-red-600 text-2xl"/>

            </div>

          </div>

        </div>

      </div>

      {/* Search */}

      <div className="bg-white rounded-2xl border shadow-sm p-6">

        <div className="flex flex-col lg:flex-row justify-between gap-4">

          <div className="relative lg:w-96">

            <FaSearch className="absolute left-4 top-4 text-gray-400"/>

            <input
              type="text"
              placeholder="Search customer..."
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              className="w-full border rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          <div className="flex gap-3">

            <select className="border rounded-xl px-5 py-3">

              <option>All Status</option>
              <option>Completed</option>
              <option>In Progress</option>
              <option>Scheduled</option>

            </select>

            <button className="border rounded-xl px-5 py-3 flex items-center gap-2">

              <FaFilter />

              Filters

            </button>

          </div>

        </div>

      </div>

      {/* Visit Table */}

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

        <div className="px-6 py-5 border-b">

          <h2 className="text-xl font-semibold">

            Visit Schedule

          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="px-6 py-4 text-left">Customer</th>
                <th className="px-6 py-4 text-left">Salesperson</th>
                <th className="px-6 py-4 text-left">Territory</th>
                <th className="px-6 py-4 text-left">Visit Date</th>
                <th className="px-6 py-4 text-left">Check In</th>
                <th className="px-6 py-4 text-left">Check Out</th>
                <th className="px-6 py-4 text-left">Duration</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-center">Action</th>

              </tr>

            </thead>

            <tbody>            {filteredVisits.map((visit, index) => (

              <tr
                key={index}
                className="border-b hover:bg-gray-50 transition"
              >

                {/* Customer */}

                <td className="px-6 py-5">

                  <div className="flex items-center gap-4">

                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">

                      {visit.customer.charAt(0)}

                    </div>

                    <div>

                      <h3 className="font-semibold">

                        {visit.customer}

                      </h3>

                      <p className="text-sm text-gray-500">

                        Customer Visit

                      </p>

                    </div>

                  </div>

                </td>

                {/* Salesperson */}

                <td className="px-6 py-5">

                  {visit.salesperson}

                </td>

                {/* Territory */}

                <td className="px-6 py-5">

                  {visit.territory}

                </td>

                {/* Date */}

                <td className="px-6 py-5">

                  {visit.date}

                </td>

                {/* Check In */}

                <td className="px-6 py-5 font-medium">

                  {visit.checkIn}

                </td>

                {/* Check Out */}

                <td className="px-6 py-5 font-medium">

                  {visit.checkOut}

                </td>

                {/* Duration */}

                <td className="px-6 py-5">

                  {visit.duration}

                </td>

                {/* Status */}

                <td className="px-6 py-5">

                  <span
                    className={`px-3 py-2 rounded-full text-xs font-semibold ${
                      visit.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : visit.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >

                    {visit.status}

                  </span>

                </td>

                {/* Actions */}

                <td className="px-6 py-5">

                  <div className="flex justify-center gap-2">

                    <button className="px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100">

                      View

                    </button>

                    <button className="px-3 py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100">

                      Check-In

                    </button>

                    <button className="px-3 py-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100">

                      Route

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

      <div className="bg-white rounded-2xl border shadow-sm px-6 py-5 flex flex-col lg:flex-row justify-between items-center">

        <p className="text-sm text-gray-500">

          Showing 1 to {filteredVisits.length} of {visits.length} visits

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

      {/* Bottom Cards */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Today's Route */}

        <div className="bg-white rounded-2xl border shadow-sm p-6">

          <h2 className="text-xl font-semibold mb-6">

            Today's Route Summary

          </h2>

          <div className="space-y-5">

            <div className="flex justify-between items-center">

              <span>Distance Covered</span>

              <span className="font-bold text-blue-600">

                124 KM

              </span>

            </div>

            <div className="flex justify-between items-center">

              <span>Total Stops</span>

              <span className="font-bold">

                18

              </span>

            </div>

            <div className="flex justify-between items-center">

              <span>Completed Visits</span>

              <span className="font-bold text-green-600">

                14

              </span>

            </div>

            <div className="flex justify-between items-center">

              <span>Remaining</span>

              <span className="font-bold text-orange-600">

                4

              </span>

            </div>

          </div>

        </div>

        {/* GPS Status */}

        <div className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-sm p-6 text-white">

          <h2 className="text-xl font-semibold mb-6">

            Live GPS Status

          </h2>

          <div className="space-y-5">

            <div className="flex justify-between">

              <span>Online Employees</span>

              <span className="font-bold">

                18

              </span>

            </div>

            <div className="flex justify-between">

              <span>Offline Employees</span>

              <span className="font-bold">

                3

              </span>

            </div>

            <div className="flex justify-between">

              <span>Average Visit Time</span>

              <span className="font-bold">

                42 mins

              </span>

            </div>

            <div className="flex justify-between">

              <span>Location Accuracy</span>

              <span className="font-bold text-green-300">

                99.2%

              </span>

            </div>

          </div>

        </div>

      </div>

      {/* Visit Analytics */}

      <div className="bg-white rounded-2xl border shadow-sm p-6">

        <h2 className="text-xl font-semibold mb-6">

          Visit Performance

        </h2>

        <div className="space-y-6">

          {[
            {
              label: "Completed Visits",
              value: 82,
              color: "bg-green-500",
            },
            {
              label: "Customer Satisfaction",
              value: 94,
              color: "bg-blue-500",
            },
            {
              label: "Route Efficiency",
              value: 89,
              color: "bg-purple-500",
            },
            {
              label: "Attendance",
              value: 97,
              color: "bg-orange-500",
            },
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
                ></div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}