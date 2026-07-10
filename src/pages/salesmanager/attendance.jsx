import { useMemo, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Search,
  UserCheck,
  UserX,
  Coffee,
  MapPin,
} from "lucide-react";

const attendanceData = [
  {
    id: 1,
    name: "Rahul Sharma",
    territory: "Indore",
    date: "2026-07-10",
    status: "Present",
    checkIn: "09:10",
    checkOut: "18:20",
    hours: "8.5h",
    location: "Vijay Nagar",
  },
  {
    id: 2,
    name: "Neha Singh",
    territory: "Bhopal",
    date: "2026-07-10",
    status: "Present",
    checkIn: "08:50",
    checkOut: "18:00",
    hours: "8.0h",
    location: "MP Nagar",
  },
  {
    id: 3,
    name: "Amit Verma",
    territory: "Ujjain",
    date: "2026-07-10",
    status: "Absent",
    checkIn: "--",
    checkOut: "--",
    hours: "0h",
    location: "Not marked",
  },
  {
    id: 4,
    name: "Priya Jain",
    territory: "Dewas",
    date: "2026-07-10",
    status: "Leave",
    checkIn: "--",
    checkOut: "--",
    hours: "0h",
    location: "Approved leave",
  },
  {
    id: 5,
    name: "Sanjay Mehta",
    territory: "Dhar",
    date: "2026-07-10",
    status: "Present",
    checkIn: "09:30",
    checkOut: "17:50",
    hours: "7.5h",
    location: "Main Market",
  },
];

const statusStyles = {
  Present: "bg-emerald-100 text-emerald-700",
  Absent: "bg-rose-100 text-rose-700",
  Leave: "bg-amber-100 text-amber-700",
};

export default function SMAttendance() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredAttendance = useMemo(() => {
    return attendanceData.filter((entry) => {
      const searchMatch =
        entry.name.toLowerCase().includes(search.toLowerCase()) ||
        entry.territory.toLowerCase().includes(search.toLowerCase());
      const statusMatch =
        statusFilter === "All" || entry.status === statusFilter;
      return searchMatch && statusMatch;
    });
  }, [search, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Sales Manager Attendance</h1>
          <p className="mt-2 text-sm text-slate-300">
            Monitor team presence, attendance status, and field check-ins in one place.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-200 backdrop-blur">
          <div className="flex items-center gap-2 font-semibold">
            <CalendarDays className="h-4 w-4" />
            Today: 10 Jul 2026
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-100">Present</p>
              <p className="mt-2 text-3xl font-bold">4</p>
            </div>
            <div className="rounded-2xl bg-emerald-400/20 p-3">
              <UserCheck className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-rose-100">Absent</p>
              <p className="mt-2 text-3xl font-bold">1</p>
            </div>
            <div className="rounded-2xl bg-rose-400/20 p-3">
              <UserX className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-100">Leave</p>
              <p className="mt-2 text-3xl font-bold">1</p>
            </div>
            <div className="rounded-2xl bg-amber-400/20 p-3">
              <Coffee className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cyan-100">Avg. Check-in</p>
              <p className="mt-2 text-3xl font-bold">09:10</p>
            </div>
            <div className="rounded-2xl bg-cyan-400/20 p-3">
              <Clock3 className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-2xl backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative lg:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or territory"
              className="w-full rounded-xl border border-slate-700 bg-slate-800/70 py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-cyan-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
          >
            <option value="All">All Status</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Leave">Leave</option>
          </select>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-sm text-slate-200">
            <thead className="bg-slate-800/80 text-left text-slate-300">
              <tr>
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Territory</th>
                <th className="px-4 py-3">Check-in</th>
                <th className="px-4 py-3">Check-out</th>
                <th className="px-4 py-3">Hours</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Location</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.map((entry) => (
                <tr key={entry.id} className="border-t border-slate-800/80 hover:bg-slate-800/60">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-white">{entry.name}</div>
                  </td>
                  <td className="px-4 py-3">{entry.territory}</td>
                  <td className="px-4 py-3">{entry.checkIn}</td>
                  <td className="px-4 py-3">{entry.checkOut}</td>
                  <td className="px-4 py-3">{entry.hours}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[entry.status]}`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin className="h-4 w-4" />
                      {entry.location}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
