import { useState } from "react";
import {
  Building2,
  GitBranch,
  MapPinned,
  Building,
  Users,
} from "lucide-react";

import Overview from "../../components/organisation/overview.jsx";
import Branches from "../../components/organisation/branches.jsx";
import Territories from "../../components/organisation/territories.jsx";
import Departments from "../../components/organisation/department.jsx";

export default function Organization() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    {
      id: "overview",
      title: "Overview",
      icon: <Building2 size={18} />,
    },
    {
      id: "branches",
      title: "Branches",
      icon: <GitBranch size={18} />,
    },
    {
      id: "territories",
      title: "Territories",
      icon: <MapPinned size={18} />,
    },
    {
      id: "departments",
      title: "Departments",
      icon: <Building size={18} />,
    },
    
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-6">

      {/* Breadcrumb */}

      <div className="mb-6">

        <p className="text-sm text-gray-500">
          Dashboard / Administration / Organization
        </p>

        <h1 className="text-3xl font-bold text-slate-800 mt-2">
          Organization Management
        </h1>

        <p className="text-gray-500 mt-2">
          Manage your organization's branches, territories,
          departments, teams and overall structure.
        </p>

      </div>

      {/* Tabs */}

      <div className="bg-white rounded-2xl shadow mb-6">

        <div className="flex flex-wrap border-b">

          {tabs.map((tab) => (

            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all duration-300 border-b-4 ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              {tab.icon}

              {tab.title}

            </button>

          ))}

        </div>

      </div>

      {/* Content */}

      <div>
        {activeTab === "overview" && <Overview onNavigateSection={setActiveTab} />}
        {activeTab === "branches" && <Branches />}
        {activeTab === "territories" && <Territories />}
        {activeTab === "departments" && <Departments />}
      </div>

    </div>
  );
}