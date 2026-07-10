import { useState } from "react";
import {
  Search,
  UserPlus,
  Download,
  Filter,
  Users,
  UserCheck,
  MapPin,
  Target,
} from "lucide-react";

export default function TeamManagement() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">

        <div>

          <h1 className="text-3xl font-bold dark:text-white">
            Team Management
          </h1>

          <p className="text-gray-500 dark:text-gray-400">
            Manage Sales Managers and Sales Persons
          </p>

        </div>

        <div className="flex gap-3">

          <button className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl hover:bg-green-700">
            <UserPlus size={18} />
            Add Team Member
          </button>

          <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700">
            <Download size={18} />
            Export
          </button>

        </div>

      </div>

      {/* Summary Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">

          <div className="flex justify-between">

            <div>

              <p className="text-gray-500">
                Sales Managers
              </p>

              <h2 className="text-3xl font-bold mt-2 dark:text-white">
                18
              </h2>

            </div>

            <Users className="text-blue-600" size={34} />

          </div>

        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">

          <div className="flex justify-between">

            <div>

              <p className="text-gray-500">
                Sales Persons
              </p>

              <h2 className="text-3xl font-bold mt-2 dark:text-white">
                152
              </h2>

            </div>

            <UserCheck className="text-green-600" size={34} />

          </div>

        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">

          <div className="flex justify-between">

            <div>

              <p className="text-gray-500">
                Territories
              </p>

              <h2 className="text-3xl font-bold mt-2 dark:text-white">
                24
              </h2>

            </div>

            <MapPin className="text-orange-600" size={34} />

          </div>

        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">

          <div className="flex justify-between">

            <div>

              <p className="text-gray-500">
                Active Targets
              </p>

              <h2 className="text-3xl font-bold mt-2 dark:text-white">
                86%
              </h2>

            </div>

            <Target className="text-purple-600" size={34} />

          </div>

        </div>

      </div>

      {/* Search & Filters */}

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-5">

        <div className="flex flex-col lg:flex-row gap-4">

          <div className="flex items-center bg-gray-100 dark:bg-slate-700 rounded-xl px-4 flex-1">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search by name, email or territory..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent ml-3 outline-none w-full py-3 dark:text-white"
            />

          </div>

          <select className="px-4 py-3 rounded-xl border dark:bg-slate-700 dark:text-white">

            <option>All Roles</option>

            <option>Sales Manager</option>

            <option>Sales Person</option>

          </select>

          <select className="px-4 py-3 rounded-xl border dark:bg-slate-700 dark:text-white">

            <option>All Territories</option>

            <option>North</option>

            <option>South</option>

            <option>East</option>

            <option>West</option>

          </select>

          <button className="flex items-center justify-center gap-2 bg-gray-800 text-white px-5 rounded-xl">

            <Filter size={18} />

            Filter

          </button>

        </div>

      </div>
            {/* Team Members Table */}

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow overflow-hidden">

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="bg-gray-100 dark:bg-slate-700">

              <tr>

                <th className="px-6 py-4 text-left">Employee</th>

                <th className="px-6 py-4 text-left">Role</th>

                <th className="px-6 py-4 text-left">Territory</th>

                <th className="px-6 py-4 text-left">Target</th>

                <th className="px-6 py-4 text-left">Performance</th>

                <th className="px-6 py-4 text-left">Status</th>

                <th className="px-6 py-4 text-center">Actions</th>

              </tr>

            </thead>

            <tbody>

              {[
                {
                  name: "Rahul Sharma",
                  email: "rahul@sfa.com",
                  role: "Sales Manager",
                  territory: "North",
                  target: "₹40 L",
                  performance: "92%",
                  status: "Active",
                },
                {
                  name: "Priya Verma",
                  email: "priya@sfa.com",
                  role: "Sales Manager",
                  territory: "West",
                  target: "₹35 L",
                  performance: "88%",
                  status: "Active",
                },
                {
                  name: "Amit Patel",
                  email: "amit@sfa.com",
                  role: "Sales Person",
                  territory: "South",
                  target: "₹18 L",
                  performance: "76%",
                  status: "Inactive",
                },
                {
                  name: "Neha Singh",
                  email: "neha@sfa.com",
                  role: "Sales Person",
                  territory: "East",
                  target: "₹20 L",
                  performance: "83%",
                  status: "Active",
                },
              ].map((member, index) => (

                <tr
                  key={index}
                  className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700"
                >

                  <td className="px-6 py-5">

                    <div className="flex items-center gap-3">

                      <img
                        src={`https://ui-avatars.com/api/?name=${member.name}`}
                        className="w-12 h-12 rounded-full"
                      />

                      <div>

                        <h3 className="font-semibold dark:text-white">
                          {member.name}
                        </h3>

                        <p className="text-sm text-gray-500">
                          {member.email}
                        </p>

                      </div>

                    </div>

                  </td>

                  <td className="px-6">
                    {member.role}
                  </td>

                  <td className="px-6">
                    {member.territory}
                  </td>

                  <td className="px-6">
                    {member.target}
                  </td>

                  <td className="px-6">

                    <div className="w-32 bg-gray-200 rounded-full h-2">

                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: member.performance,
                        }}
                      ></div>

                    </div>

                    <span className="text-sm">
                      {member.performance}
                    </span>

                  </td>

                  <td className="px-6">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        member.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {member.status}
                    </span>

                  </td>

                  <td className="px-6">

                    <div className="flex justify-center gap-3">

                      <button className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600">
                        Edit
                      </button>

                      <button className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600">
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
          Showing 1 to 4 of 152 members
        </p>

        <div className="flex gap-2">

          <button className="px-4 py-2 rounded-lg border">
            Previous
          </button>

          <button className="px-4 py-2 rounded-lg bg-blue-600 text-white">
            1
          </button>

          <button className="px-4 py-2 rounded-lg border">
            2
          </button>

          <button className="px-4 py-2 rounded-lg border">
            3
          </button>

          <button className="px-4 py-2 rounded-lg border">
            Next
          </button>

        </div>

      </div>

    </div>
  );
}