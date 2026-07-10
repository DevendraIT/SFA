import React, { useState } from "react";
import {
  Calendar,
  Search,
  Filter,
  Plus,
  Clock,
  Users,
  Video,
  MapPin,
  Eye,
} from "lucide-react";

const meetings = [
  {
    id: "MT001",
    title: "Weekly Sales Review",
    date: "08 Jul 2026",
    time: "10:00 AM",
    mode: "Online",
    location: "Google Meet",
    organizer: "Head of Sales",
    attendees: 12,
    status: "Today",
  },
  {
    id: "MT002",
    title: "Territory Planning",
    date: "09 Jul 2026",
    time: "02:00 PM",
    mode: "Offline",
    location: "Conference Room A",
    organizer: "Regional Manager",
    attendees: 8,
    status: "Upcoming",
  },
  {
    id: "MT003",
    title: "Monthly Target Discussion",
    date: "10 Jul 2026",
    time: "11:30 AM",
    mode: "Online",
    location: "Microsoft Teams",
    organizer: "Sales Director",
    attendees: 20,
    status: "Upcoming",
  },
];

export default function HOSMeetings() {
  const [search, setSearch] = useState("");

  const filteredMeetings = meetings.filter(
    (meeting) =>
      meeting.title.toLowerCase().includes(search.toLowerCase()) ||
      meeting.organizer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col lg:flex-row justify-between lg:items-center">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            Meetings
          </h1>

          <p className="text-gray-500 mt-1">
            Schedule, manage and monitor all meetings.
          </p>

        </div>

        <button className="mt-4 lg:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center gap-2">

          <Plus size={18} />

          Create Meeting

        </button>

      </div>

      {/* Summary Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        <div className="bg-white rounded-xl shadow p-5">

          <Calendar className="text-blue-600" size={32} />

          <p className="mt-3 text-gray-500">
            Total Meetings
          </p>

          <h2 className="text-3xl font-bold">
            82
          </h2>

        </div>

        <div className="bg-white rounded-xl shadow p-5">

          <Clock className="text-green-600" size={32} />

          <p className="mt-3 text-gray-500">
            Today's Meetings
          </p>

          <h2 className="text-3xl font-bold">
            6
          </h2>

        </div>

        <div className="bg-white rounded-xl shadow p-5">

          <Users className="text-purple-600" size={32} />

          <p className="mt-3 text-gray-500">
            Team Meetings
          </p>

          <h2 className="text-3xl font-bold">
            24
          </h2>

        </div>

        <div className="bg-white rounded-xl shadow p-5">

          <Video className="text-orange-500" size={32} />

          <p className="mt-3 text-gray-500">
            Online Meetings
          </p>

          <h2 className="text-3xl font-bold">
            41
          </h2>

        </div>

      </div>

      {/* Search */}

      <div className="bg-white rounded-xl shadow p-5">

        <div className="flex flex-col lg:flex-row gap-4">

          <div className="relative flex-1">

            <Search
              size={18}
              className="absolute left-3 top-3 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search meetings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-lg pl-10 pr-4 py-2"
            />

          </div>

          <button className="border rounded-lg px-5 py-2 flex items-center gap-2">

            <Filter size={18} />

            Filter

          </button>

        </div>

      </div>

      {/* Meeting Table */}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-4 text-left">Meeting</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Time</th>
                <th className="p-4 text-left">Mode</th>
                <th className="p-4 text-left">Organizer</th>
                <th className="p-4 text-left">Attendees</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-center">Action</th>

              </tr>

            </thead>

            <tbody>

              {filteredMeetings.map((meeting) => (

                <tr
                  key={meeting.id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="p-4 font-medium">
                    {meeting.title}
                  </td>

                  <td className="p-4">
                    {meeting.date}
                  </td>

                  <td className="p-4">
                    {meeting.time}
                  </td>

                  <td className="p-4">

                    <div className="flex items-center gap-2">

                      {meeting.mode === "Online" ? (
                        <Video size={16} className="text-blue-600" />
                      ) : (
                        <MapPin size={16} className="text-red-600" />
                      )}

                      {meeting.location}

                    </div>

                  </td>

                  <td className="p-4">
                    {meeting.organizer}
                  </td>

                  <td className="p-4">
                    {meeting.attendees}
                  </td>

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        meeting.status === "Today"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {meeting.status}
                    </span>

                  </td>

                  <td className="p-4 text-center">

                    <button className="text-blue-600 hover:text-blue-800">

                      <Eye size={18} />

                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
            {/* Bottom Section */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Today's Meetings */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-5">
            Today's Meetings
          </h2>

          {[
            {
              title: "Sales Review",
              time: "10:00 AM",
            },
            {
              title: "Client Meeting",
              time: "12:30 PM",
            },
            {
              title: "Regional Planning",
              time: "03:00 PM",
            },
            {
              title: "Target Discussion",
              time: "05:00 PM",
            },
          ].map((meeting, index) => (

            <div
              key={index}
              className="flex justify-between items-center py-3 border-b last:border-0"
            >

              <div>

                <p className="font-semibold">
                  {meeting.title}
                </p>

                <p className="text-sm text-gray-500">
                  {meeting.time}
                </p>

              </div>

              <Clock className="text-blue-600" size={18} />

            </div>

          ))}

        </div>

        {/* Team Meetings */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-5">
            Team Meetings
          </h2>

          {[
            {
              team: "North Zone",
              members: 8,
            },
            {
              team: "South Zone",
              members: 12,
            },
            {
              team: "East Zone",
              members: 10,
            },
            {
              team: "West Zone",
              members: 9,
            },
          ].map((team, index) => (

            <div
              key={index}
              className="border rounded-lg p-4 mb-4"
            >

              <div className="flex justify-between">

                <h3 className="font-semibold">
                  {team.team}
                </h3>

                <span className="text-blue-600 font-semibold">
                  {team.members} Members
                </span>

              </div>

            </div>

          ))}

        </div>

        {/* Calendar */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-5">
            Calendar
          </h2>

          <div className="grid grid-cols-7 gap-2 text-center">

            {["S","M","T","W","T","F","S"].map((day,index)=>(
              <div
                key={index}
                className="font-semibold text-gray-500"
              >
                {day}
              </div>
            ))}

            {[...Array(31)].map((_,index)=>(

              <div
                key={index}
                className={`rounded-lg p-2 cursor-pointer ${
                  index===7
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {index+1}
              </div>

            ))}

          </div>

        </div>

      </div>

      {/* Meeting Notes */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-semibold mb-5">
          Meeting Notes
        </h2>

        <textarea
          rows={6}
          placeholder="Write meeting notes..."
          className="w-full border rounded-lg p-4 resize-none"
        ></textarea>

        <div className="mt-4 flex justify-end">

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg">
            Save Notes
          </button>

        </div>

      </div>

      {/* Meeting Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

        <div className="bg-white rounded-xl shadow p-5">

          <h4 className="text-gray-500">
            Completed
          </h4>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            64
          </h2>

        </div>

        <div className="bg-white rounded-xl shadow p-5">

          <h4 className="text-gray-500">
            Upcoming
          </h4>

          <h2 className="text-3xl font-bold text-blue-600 mt-2">
            18
          </h2>

        </div>

        <div className="bg-white rounded-xl shadow p-5">

          <h4 className="text-gray-500">
            Cancelled
          </h4>

          <h2 className="text-3xl font-bold text-red-600 mt-2">
            3
          </h2>

        </div>

        <div className="bg-white rounded-xl shadow p-5">

          <h4 className="text-gray-500">
            Attendance
          </h4>

          <h2 className="text-3xl font-bold text-purple-600 mt-2">
            94%
          </h2>

        </div>

      </div>

      {/* Recent Activity */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-semibold mb-5">
          Recent Meeting Activity
        </h2>

        <div className="space-y-4">

          {[
            "Weekly Sales Review completed successfully.",
            "Client meeting rescheduled.",
            "Monthly target discussion created.",
            "Regional planning meeting updated.",
            "Sales Manager invited 6 participants.",
          ].map((item,index)=>(

            <div
              key={index}
              className="border rounded-lg p-4 hover:bg-gray-50"
            >
              {item}
            </div>

          ))}

        </div>

      </div>

      {/* Pagination */}

      <div className="flex flex-col md:flex-row justify-between items-center">

        <p className="text-gray-500">
          Showing 1–3 of 82 meetings
        </p>

        <div className="flex gap-2 mt-4 md:mt-0">

          <button className="border px-4 py-2 rounded-lg">
            Previous
          </button>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            1
          </button>

          <button className="border px-4 py-2 rounded-lg">
            2
          </button>

          <button className="border px-4 py-2 rounded-lg">
            3
          </button>

          <button className="border px-4 py-2 rounded-lg">
            Next
          </button>

        </div>

      </div>

    </div>
  );
}