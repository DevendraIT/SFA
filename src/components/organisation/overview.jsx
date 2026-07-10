import { useEffect, useState } from "react";
import {
  Building2,
  GitBranch,
  MapPinned,
  Building,
  Users,
  Plus,
  TrendingUp,
  Clock,
} from "lucide-react";

export default function Overview({ onNavigateSection }) {
  const [counts, setCounts] = useState({ branches: 0, territories: 0, departments: 0, teams: 3, employees: 0 });

  useEffect(() => {
    try {
      const branches = JSON.parse(localStorage.getItem("sfa_org_branches") || "[]");
      const territories = JSON.parse(localStorage.getItem("sfa_org_territories") || "[]");
      const departments = JSON.parse(localStorage.getItem("sfa_org_departments") || "[]");
      const employees = [...branches, ...territories, ...departments].reduce((sum, item) => sum + Number(item.employees || 0), 0);
      setCounts({
        branches: branches.length,
        territories: territories.length,
        departments: departments.length,
        teams: 3,
        employees,
      });
    } catch {
      setCounts({ branches: 0, territories: 0, departments: 0, teams: 3, employees: 0 });
    }
  }, []);

  const organization = {
    name: "ABC Pharma Pvt. Ltd.",
    code: "ORG001",
    industry: "Pharmaceutical",
    gst: "23ABCDE1234F1Z5",
    email: "info@abcpharma.com",
    phone: "+91 9876543210",
    website: "www.abcpharma.com",
    address: "Indore, Madhya Pradesh",
    status: "Active",
    branches: counts.branches,
    territories: counts.territories,
    departments: counts.departments,
    teams: counts.teams,
    employees: counts.employees,
  };

  const stats = [
    {
      title: "Branches",
      value: organization.branches,
      icon: <GitBranch size={28} />,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Territories",
      value: organization.territories,
      icon: <MapPinned size={28} />,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Departments",
      value: organization.departments,
      icon: <Building size={28} />,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Teams",
      value: organization.teams,
      icon: <Users size={28} />,
      color: "bg-pink-100 text-pink-600",
    },
    {
      title: "Employees",
      value: organization.employees,
      icon: <Building2 size={28} />,
      color: "bg-blue-100 text-blue-600",
    },
  ];

  return (
    <div className="space-y-8">

      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">

        {stats.map((item, index) => (

          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm p-6"
          >
            <div
              className={`w-14 h-14 rounded-xl flex items-center justify-center ${item.color}`}
            >
              {item.icon}
            </div>

            <h3 className="text-gray-500 mt-5">
              {item.title}
            </h3>

            <h2 className="text-3xl font-bold mt-2">
              {item.value}
            </h2>
          </div>

        ))}

      </div>

      {/* Organization Information */}

      <div className="bg-white rounded-2xl shadow-sm p-8">

        <div className="flex justify-between items-start flex-wrap gap-6">

          <div>

            <h2 className="text-2xl font-bold">
              {organization.name}
            </h2>

            <span className="inline-block mt-3 px-4 py-2 rounded-full bg-green-100 text-green-700 font-medium">
              {organization.status}
            </span>

          </div>

          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl" onClick={() => onNavigateSection?.("overview")}>

            <Plus size={18} />

            Edit Organization

          </button>

        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mt-10">

          <div>
            <p className="text-gray-500">Organization Code</p>
            <h3 className="font-semibold mt-2">
              {organization.code}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">Industry</p>
            <h3 className="font-semibold mt-2">
              {organization.industry}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">GST Number</p>
            <h3 className="font-semibold mt-2">
              {organization.gst}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">Email</p>
            <h3 className="font-semibold mt-2">
              {organization.email}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">Phone</p>
            <h3 className="font-semibold mt-2">
              {organization.phone}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">Website</p>
            <h3 className="font-semibold mt-2">
              {organization.website}
            </h3>
          </div>

          <div className="md:col-span-2 xl:col-span-3">
            <p className="text-gray-500">Address</p>
            <h3 className="font-semibold mt-2">
              {organization.address}
            </h3>
          </div>

        </div>

      </div>

      {/* Quick Actions */}

      <div>

        <h2 className="text-xl font-bold mb-5">
          Quick Actions
        </h2>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

          <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-6 text-left transition" onClick={() => onNavigateSection?.("branches")}>

            <GitBranch size={35} />

            <h3 className="text-xl font-bold mt-5">
              Add Branch
            </h3>

            <p className="text-blue-100 mt-2">
              Create and manage branches.
            </p>

          </button>

          <button className="bg-green-600 hover:bg-green-700 text-white rounded-2xl p-6 text-left transition" onClick={() => onNavigateSection?.("territories")}>

            <MapPinned size={35} />

            <h3 className="text-xl font-bold mt-5">
              Add Territory
            </h3>

            <p className="text-green-100 mt-2">
              Create new territories.
            </p>

          </button>

          <button className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl p-6 text-left transition" onClick={() => onNavigateSection?.("departments")}>

            <Building size={35} />

            <h3 className="text-xl font-bold mt-5">
              Add Department
            </h3>

            <p className="text-purple-100 mt-2">
              Manage departments.
            </p>

          </button>

          <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-2xl p-6 text-left transition">

            <Users size={35} />

            <h3 className="text-xl font-bold mt-5">
              Add Team
            </h3>

            <p className="text-orange-100 mt-2">
              Create new sales teams.
            </p>

          </button>

        </div>

      </div>

      {/* Summary & Activity */}

      <div className="grid lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <div className="flex items-center gap-2 mb-6">

            <TrendingUp className="text-green-600" />

            <h2 className="text-xl font-bold">
              Organization Summary
            </h2>

          </div>

          <div className="space-y-5">

            <div className="flex justify-between">
              <span>Total Branches</span>
              <span className="font-bold">
                {organization.branches}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Total Territories</span>
              <span className="font-bold">
                {organization.territories}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Total Departments</span>
              <span className="font-bold">
                {organization.departments}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Total Teams</span>
              <span className="font-bold">
                {organization.teams}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Total Employees</span>
              <span className="font-bold">
                {organization.employees}
              </span>
            </div>

          </div>

        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <div className="flex items-center gap-2 mb-6">

            <Clock className="text-blue-600" />

            <h2 className="text-xl font-bold">
              Recent Activities
            </h2>

          </div>

          <div className="space-y-5">

            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-semibold">
                New Branch Added
              </h3>
              <p className="text-sm text-gray-500">
                Indore Branch was created successfully.
              </p>
            </div>

            <div className="border-l-4 border-green-600 pl-4">
              <h3 className="font-semibold">
                Territory Updated
              </h3>
              <p className="text-sm text-gray-500">
                Central Zone assigned to Branch.
              </p>
            </div>

            <div className="border-l-4 border-purple-600 pl-4">
              <h3 className="font-semibold">
                Department Created
              </h3>
              <p className="text-sm text-gray-500">
                Marketing department added.
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}