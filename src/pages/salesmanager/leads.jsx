import { useState } from "react";
import {
  FaSearch,
  FaUserPlus,
  FaFire,
  FaRobot,
  FaCheckCircle,
  FaFilter,
  FaDownload,
  FaUsers,
} from "react-icons/fa";

export default function SMLeads() {

  const [search,setSearch]=useState("");

  const leads=[

    {
      id:"LEAD001",
      name:"Rohan Mehta",
      company:"ABC Traders",
      source:"Website",
      territory:"Indore",
      salesperson:"Rahul Sharma",
      aiScore:96,
      priority:"High",
      status:"Qualified"
    },

    {
      id:"LEAD002",
      name:"Priyanshu Jain",
      company:"Global Pharma",
      source:"Referral",
      territory:"Bhopal",
      salesperson:"Neha Singh",
      aiScore:88,
      priority:"Medium",
      status:"Contacted"
    },

    {
      id:"LEAD003",
      name:"Ankit Verma",
      company:"Modern Retail",
      source:"Facebook",
      territory:"Ujjain",
      salesperson:"Amit Verma",
      aiScore:72,
      priority:"Low",
      status:"New"
    },

    {
      id:"LEAD004",
      name:"Ritika Shah",
      company:"Sai Distributor",
      source:"Website",
      territory:"Dewas",
      salesperson:"Priya Jain",
      aiScore:93,
      priority:"High",
      status:"Qualified"
    }

  ];

  const filteredLeads=leads.filter((lead)=>

      lead.name.toLowerCase().includes(search.toLowerCase()) ||

      lead.company.toLowerCase().includes(search.toLowerCase()) ||

      lead.id.toLowerCase().includes(search.toLowerCase())

  );

  return(

<div className="space-y-8">

{/* Header */}

<div className="flex flex-col lg:flex-row justify-between lg:items-center">

<div>

<h1 className="text-3xl font-bold">

Lead Management

</h1>

<p className="text-gray-500 mt-2">

Manage, qualify and convert leads into customers.

</p>

</div>

<div className="flex gap-3 mt-5 lg:mt-0">

<button className="border rounded-xl px-5 py-3 flex items-center gap-2 hover:bg-gray-100">

<FaDownload/>

Export

</button>

<button className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-700">

<FaUserPlus/>

Add Lead

</button>

</div>

</div>

{/* KPI */}

<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

<div className="bg-white p-6 rounded-2xl shadow border">

<div className="flex justify-between">

<div>

<p className="text-gray-500">

Total Leads

</p>

<h2 className="text-3xl font-bold mt-3">

438

</h2>

</div>

<div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">

<FaUsers className="text-blue-600 text-2xl"/>

</div>

</div>

</div>

<div className="bg-white p-6 rounded-2xl shadow border">

<div className="flex justify-between">

<div>

<p className="text-gray-500">

Qualified

</p>

<h2 className="text-3xl font-bold mt-3">

186

</h2>

</div>

<div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">

<FaCheckCircle className="text-green-600 text-2xl"/>

</div>

</div>

</div>

<div className="bg-white p-6 rounded-2xl shadow border">

<div className="flex justify-between">

<div>

<p className="text-gray-500">

Hot Leads

</p>

<h2 className="text-3xl font-bold mt-3">

64

</h2>

</div>

<div className="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center">

<FaFire className="text-red-600 text-2xl"/>

</div>

</div>

</div>

<div className="bg-white p-6 rounded-2xl shadow border">

<div className="flex justify-between">

<div>

<p className="text-gray-500">

AI Score

</p>

<h2 className="text-3xl font-bold mt-3">

92%

</h2>

</div>

<div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center">

<FaRobot className="text-purple-600 text-2xl"/>

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
placeholder="Search Lead..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="w-full border rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
/>

</div>

<div className="flex gap-3">

<select className="border rounded-xl px-5 py-3">

<option>All Sources</option>
<option>Website</option>
<option>Referral</option>
<option>Facebook</option>
<option>Instagram</option>

</select>

<button className="border rounded-xl px-5 py-3 flex items-center gap-2">

<FaFilter/>

Filters

</button>

</div>

</div>

</div>

{/* Lead Table */}

<div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

<div className="px-6 py-5 border-b">

<h2 className="text-xl font-semibold">

Lead List

</h2>

<p className="text-sm text-gray-500 mt-1">

All assigned leads with AI scoring.

</p>

</div>

<div className="overflow-x-auto">

<table className="min-w-full">

<thead className="bg-gray-100">

<tr>

<th className="px-6 py-4 text-left">Lead</th>

<th className="px-6 py-4 text-left">Source</th>

<th className="px-6 py-4 text-left">Territory</th>

<th className="px-6 py-4 text-left">Salesperson</th>

<th className="px-6 py-4 text-left">AI Score</th>

<th className="px-6 py-4 text-left">Priority</th>

<th className="px-6 py-4 text-left">Status</th>

<th className="px-6 py-4 text-center">Action</th>

</tr>

</thead>

<tbody>
                {filteredLeads.map((lead, index) => (

              <tr
                key={index}
                className="border-b hover:bg-gray-50 transition"
              >

                {/* Lead */}

                <td className="px-6 py-5">

                  <div className="flex items-center gap-4">

                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">

                      {lead.name.charAt(0)}

                    </div>

                    <div>

                      <h3 className="font-semibold">

                        {lead.name}

                      </h3>

                      <p className="text-sm text-gray-500">

                        {lead.company}

                      </p>

                      <p className="text-xs text-gray-400">

                        {lead.id}

                      </p>

                    </div>

                  </div>

                </td>

                {/* Source */}

                <td className="px-6 py-5">

                  {lead.source}

                </td>

                {/* Territory */}

                <td className="px-6 py-5">

                  {lead.territory}

                </td>

                {/* Salesperson */}

                <td className="px-6 py-5">

                  {lead.salesperson}

                </td>

                {/* AI Score */}

                <td className="px-6 py-5">

                  <div>

                    <div className="flex justify-between mb-2">

                      <span className="font-semibold">

                        {lead.aiScore}%

                      </span>

                    </div>

                    <div className="w-28 bg-gray-200 rounded-full h-2">

                      <div
                        className={`h-2 rounded-full ${
                          lead.aiScore >= 90
                            ? "bg-green-500"
                            : lead.aiScore >= 75
                            ? "bg-blue-500"
                            : "bg-yellow-500"
                        }`}
                        style={{
                          width: `${lead.aiScore}%`,
                        }}
                      />

                    </div>

                  </div>

                </td>

                {/* Priority */}

                <td className="px-6 py-5">

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      lead.priority === "High"
                        ? "bg-red-100 text-red-600"
                        : lead.priority === "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >

                    {lead.priority}

                  </span>

                </td>

                {/* Status */}

                <td className="px-6 py-5">

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      lead.status === "Qualified"
                        ? "bg-green-100 text-green-700"
                        : lead.status === "Contacted"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >

                    {lead.status}

                  </span>

                </td>

                {/* Action */}

                <td className="px-6 py-5">

                  <div className="flex justify-center gap-2">

                    <button className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">

                      View

                    </button>

                    <button className="px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100">

                      Edit

                    </button>

                    <button className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">

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

      <div className="bg-white rounded-2xl border shadow-sm px-6 py-5 flex flex-col lg:flex-row justify-between items-center">

        <p className="text-sm text-gray-500">

          Showing 1 to {filteredLeads.length} of {leads.length} Leads

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

            3

          </button>

          <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">

            Next

          </button>

        </div>

      </div>

      {/* Bottom Analytics */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* AI Recommendation */}

        <div className="bg-linear-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white">

          <div className="flex items-center gap-3">

            <FaRobot className="text-3xl"/>

            <h2 className="text-xl font-semibold">

              AI Recommendations

            </h2>

          </div>

          <div className="mt-6 space-y-4">

            <div className="bg-white/10 rounded-xl p-4">

              🎯 Contact <strong>Rohan Mehta</strong> today.
              Conversion probability: <strong>96%</strong>

            </div>

            <div className="bg-white/10 rounded-xl p-4">

              📈 Website leads are converting
              <strong> 18% better </strong>
              than social media leads.

            </div>

            <div className="bg-white/10 rounded-xl p-4">

              🔥 7 High Priority leads have
              not been contacted in the last 48 hours.

            </div>

          </div>

        </div>

        {/* Pipeline */}

        <div className="bg-white rounded-2xl border shadow-sm p-6">

          <h2 className="text-xl font-semibold mb-6">

            Lead Pipeline

          </h2>

          <div className="space-y-5">

            {[
              { stage: "New", value: 54, color: "bg-gray-500" },
              { stage: "Contacted", value: 86, color: "bg-blue-500" },
              { stage: "Qualified", value: 120, color: "bg-green-500" },
              { stage: "Proposal", value: 48, color: "bg-purple-500" },
              { stage: "Negotiation", value: 29, color: "bg-orange-500" },
              { stage: "Won", value: 18, color: "bg-emerald-500" },
            ].map((item, index) => (

              <div key={index}>

                <div className="flex justify-between mb-2">

                  <span>

                    {item.stage}

                  </span>

                  <span className="font-semibold">

                    {item.value}

                  </span>

                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">

                  <div
                    className={`${item.color} h-3 rounded-full`}
                    style={{
                      width: `${Math.min(item.value,100)}%`
                    }}
                  />

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  );

}