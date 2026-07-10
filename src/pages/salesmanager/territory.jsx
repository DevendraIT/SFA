import React from "react";
import {
  MapPinned,
  Users,
  DollarSign,
  TrendingUp,
  Filter,
  Download,
  Search,
  Map,
} from "lucide-react";

export default function SMTerritory() {

  const territories = [
    {
      city: "Bhopal",
      manager: "Rahul Sharma",
      executives: 12,
      revenue: "₹66L",
      achievement: 94,
      status: "Excellent",
    },
    {
      city: "Indore",
      manager: "Neha Verma",
      executives: 10,
      revenue: "₹58L",
      achievement: 88,
      status: "Good",
    },
    {
      city: "Jabalpur",
      manager: "Amit Patel",
      executives: 8,
      revenue: "₹46L",
      achievement: 81,
      status: "Average",
    },
    {
      city: "Gwalior",
      manager: "Rohit Singh",
      executives: 7,
      revenue: "₹39L",
      achievement: 75,
      status: "Average",
    },
    {
      city: "Ujjain",
      manager: "Priya Jain",
      executives: 6,
      revenue: "₹31L",
      achievement: 68,
      status: "Needs Attention",
    },
  ];

  return (

    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col lg:flex-row justify-between lg:items-center">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            Territory Management
          </h1>

          <p className="text-gray-500 mt-2">
            Monitor sales performance across all territories.
          </p>

        </div>

        <div className="flex gap-3 mt-5 lg:mt-0">

          <button className="border rounded-xl px-5 py-3 flex items-center gap-2 hover:bg-gray-100">

            <Filter size={18}/>

            Filter

          </button>

          <button className="bg-blue-600 text-white rounded-xl px-5 py-3 flex items-center gap-2 hover:bg-blue-700">

            <Download size={18}/>

            Export

          </button>

        </div>

      </div>

      {/* KPI Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <MapPinned className="text-blue-600" size={34}/>

          <p className="mt-4 text-gray-500">Total Territories</p>

          <h2 className="text-3xl font-bold mt-2">18</h2>

        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <Users className="text-green-600" size={34}/>

          <p className="mt-4 text-gray-500">Executives</p>

          <h2 className="text-3xl font-bold mt-2">86</h2>

        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <DollarSign className="text-purple-600" size={34}/>

          <p className="mt-4 text-gray-500">Revenue</p>

          <h2 className="text-3xl font-bold mt-2">₹2.48 Cr</h2>

        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <TrendingUp className="text-orange-600" size={34}/>

          <p className="mt-4 text-gray-500">Achievement</p>

          <h2 className="text-3xl font-bold mt-2">84%</h2>

        </div>

      </div>

      {/* Search */}

      <div className="bg-white rounded-2xl shadow-sm p-5">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-4 top-3 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search Territory..."
            className="w-full border rounded-xl py-3 pl-11 pr-4"
          />

        </div>

      </div>

      {/* Territory Table */}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-4 text-left">Territory</th>
                <th className="p-4 text-left">Manager</th>
                <th className="p-4 text-left">Executives</th>
                <th className="p-4 text-left">Revenue</th>
                <th className="p-4 text-left">Achievement</th>
                <th className="p-4 text-left">Status</th>

              </tr>

            </thead>

            <tbody>

              {territories.map((item,index)=>(

                <tr
                  key={index}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-4 font-semibold">

                    {item.city}

                  </td>

                  <td className="p-4">

                    {item.manager}

                  </td>

                  <td className="p-4">

                    {item.executives}

                  </td>

                  <td className="p-4 font-semibold text-green-600">

                    {item.revenue}

                  </td>

                  <td className="p-4">

                    {item.achievement}%

                  </td>

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status==="Excellent"
                          ? "bg-green-100 text-green-700"
                          : item.status==="Good"
                          ? "bg-blue-100 text-blue-700"
                          : item.status==="Average"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >

                      {item.status}

                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
            {/* Territory Analytics */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Territory Performance */}

        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm p-6">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-xl font-semibold">
              Territory Performance
            </h2>

            <Map className="text-blue-600" />

          </div>

          {[
            {
              city: "Bhopal",
              revenue: "₹66L",
              customers: 182,
              progress: 94,
            },
            {
              city: "Indore",
              revenue: "₹58L",
              customers: 164,
              progress: 88,
            },
            {
              city: "Jabalpur",
              revenue: "₹46L",
              customers: 142,
              progress: 81,
            },
            {
              city: "Gwalior",
              revenue: "₹39L",
              customers: 126,
              progress: 75,
            },
            {
              city: "Ujjain",
              revenue: "₹31L",
              customers: 98,
              progress: 68,
            },
          ].map((item) => (

            <div
              key={item.city}
              className="mb-6"
            >

              <div className="flex justify-between mb-2">

                <div>

                  <h3 className="font-semibold">
                    {item.city}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {item.customers} Customers
                  </p>

                </div>

                <span className="font-bold text-green-600">
                  {item.revenue}
                </span>

              </div>

              <div className="bg-gray-200 rounded-full h-3">

                <div
                  className="bg-blue-600 h-3 rounded-full"
                  style={{
                    width: `${item.progress}%`,
                  }}
                />

              </div>

            </div>

          ))}

        </div>

        {/* AI Territory Insights */}

        <div className="bg-linear-to-br from-blue-600 to-indigo-700 text-white rounded-2xl shadow-sm p-6">

          <h2 className="text-xl font-semibold mb-6">

            AI Territory Insights

          </h2>

          <div className="space-y-5">

            <div className="bg-white/10 rounded-xl p-4">

              <h3 className="font-semibold mb-2">
                Best Territory
              </h3>

              <p className="text-sm">
                Bhopal is leading with 94% target achievement.
              </p>

            </div>

            <div className="bg-white/10 rounded-xl p-4">

              <h3 className="font-semibold mb-2">
                Needs Improvement
              </h3>

              <p className="text-sm">
                Ujjain requires 20% more customer visits this month.
              </p>

            </div>

            <div className="bg-white/10 rounded-xl p-4">

              <h3 className="font-semibold mb-2">
                Recommendation
              </h3>

              <p className="text-sm">
                Allocate two additional executives to Gwalior territory.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Top Territories */}

      <div className="bg-white rounded-2xl shadow-sm p-6">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-xl font-semibold">
            Top Performing Territories
          </h2>

          <button className="text-blue-600 hover:underline">
            View All
          </button>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {[
            {
              city: "Bhopal",
              revenue: "₹66L",
              customers: 182,
              growth: "+18%",
            },
            {
              city: "Indore",
              revenue: "₹58L",
              customers: 164,
              growth: "+14%",
            },
            {
              city: "Jabalpur",
              revenue: "₹46L",
              customers: 142,
              growth: "+11%",
            },
          ].map((item) => (

            <div
              key={item.city}
              className="border rounded-2xl p-6 hover:shadow-lg transition"
            >

              <h3 className="text-xl font-bold">
                {item.city}
              </h3>

              <p className="text-gray-500 mt-2">
                Customers : {item.customers}
              </p>

              <h2 className="text-3xl font-bold text-green-600 mt-5">
                {item.revenue}
              </h2>

              <span className="inline-block mt-4 px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold">
                {item.growth}
              </span>

            </div>

          ))}

        </div>

      </div>

      {/* Territory Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="bg-green-50 rounded-2xl p-6">

          <p className="text-green-600 font-medium">
            Active Territories
          </p>

          <h2 className="text-3xl font-bold mt-3">
            18
          </h2>

        </div>

        <div className="bg-blue-50 rounded-2xl p-6">

          <p className="text-blue-600 font-medium">
            Total Customers
          </p>

          <h2 className="text-3xl font-bold mt-3">
            682
          </h2>

        </div>

        <div className="bg-purple-50 rounded-2xl p-6">

          <p className="text-purple-600 font-medium">
            Executives
          </p>

          <h2 className="text-3xl font-bold mt-3">
            86
          </h2>

        </div>

        <div className="bg-orange-50 rounded-2xl p-6">

          <p className="text-orange-600 font-medium">
            Growth
          </p>

          <h2 className="text-3xl font-bold mt-3">
            +14%
          </h2>

        </div>

      </div>

      {/* Pagination */}

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">

        <p className="text-gray-500">
          Showing 1–5 of 18 Territories
        </p>

        <div className="flex gap-2">

          <button className="border px-4 py-2 rounded-lg hover:bg-gray-100">
            Previous
          </button>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            1
          </button>

          <button className="border px-4 py-2 rounded-lg hover:bg-gray-100">
            2
          </button>

          <button className="border px-4 py-2 rounded-lg hover:bg-gray-100">
            3
          </button>

          <button className="border px-4 py-2 rounded-lg hover:bg-gray-100">
            Next
          </button>

        </div>

      </div>

    </div>
  );
}