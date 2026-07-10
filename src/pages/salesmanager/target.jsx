import React from "react";
import {
  Target,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Calendar,
  Filter,
  Download,
} from "lucide-react";

export default function SMTargets() {

  const cards = [
    {
      title: "Monthly Target",
      value: "₹3.00 Cr",
      progress: "84%",
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      title: "Orders Target",
      value: "1500",
      progress: "86%",
      icon: ShoppingCart,
      color: "bg-blue-500",
    },
    {
      title: "Customer Target",
      value: "750",
      progress: "91%",
      icon: Users,
      color: "bg-purple-500",
    },
    {
      title: "Overall Achievement",
      value: "84%",
      progress: "+12%",
      icon: TrendingUp,
      color: "bg-orange-500",
    },
  ];

  return (

    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col lg:flex-row justify-between lg:items-center">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">

            Sales Targets

          </h1>

          <p className="text-gray-500 mt-2">

            Track monthly, quarterly and yearly sales targets.

          </p>

        </div>

        <div className="flex gap-3 mt-5 lg:mt-0">

          <button className="flex items-center gap-2 border rounded-xl px-5 py-3 hover:bg-gray-100">

            <Filter size={18}/>

            Filter

          </button>

          <button className="flex items-center gap-2 bg-blue-600 text-white rounded-xl px-5 py-3 hover:bg-blue-700">

            <Download size={18}/>

            Export

          </button>

        </div>

      </div>

      {/* KPI */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {cards.map((item)=>{

          const Icon=item.icon;

          return(

            <div
              key={item.title}
              className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition"
            >

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-gray-500">

                    {item.title}

                  </p>

                  <h2 className="text-3xl font-bold mt-2">

                    {item.value}

                  </h2>

                </div>

                <div className={`${item.color} w-14 h-14 rounded-xl flex items-center justify-center text-white`}>

                  <Icon size={28}/>

                </div>

              </div>

              <p className="mt-5 text-green-600 font-semibold">

                {item.progress}

              </p>

            </div>

          )

        })}

      </div>

      {/* Monthly Target */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm p-6">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-xl font-semibold">

              Monthly Target Progress

            </h2>

            <Calendar/>

          </div>

          {[
            {
              title:"Revenue",
              target:"₹3 Cr",
              achieved:"₹2.48 Cr",
              progress:84,
              color:"bg-green-500"
            },
            {
              title:"Orders",
              target:"1500",
              achieved:"1284",
              progress:86,
              color:"bg-blue-500"
            },
            {
              title:"New Customers",
              target:"80",
              achieved:"61",
              progress:76,
              color:"bg-purple-500"
            },
            {
              title:"Collections",
              target:"₹2.7 Cr",
              achieved:"₹2.15 Cr",
              progress:80,
              color:"bg-orange-500"
            },
          ].map((item)=>(

            <div
              key={item.title}
              className="mb-8"
            >

              <div className="flex justify-between mb-2">

                <div>

                  <h3 className="font-semibold">

                    {item.title}

                  </h3>

                  <p className="text-sm text-gray-500">

                    {item.achieved} / {item.target}

                  </p>

                </div>

                <span className="font-bold">

                  {item.progress}%

                </span>

              </div>

              <div className="w-full bg-gray-200 rounded-full h-4">

                <div
                  className={`${item.color} h-4 rounded-full`}
                  style={{
                    width:`${item.progress}%`
                  }}
                />

              </div>

            </div>

          ))}

        </div>

        {/* Target Summary */}

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <h2 className="text-xl font-semibold mb-6">

            Overall Target

          </h2>

          <div className="flex flex-col items-center">

            <div className="w-44 h-44 rounded-full border-14 border-blue-600 flex items-center justify-center">

              <div className="text-center">

                <h2 className="text-5xl font-bold">

                  84%

                </h2>

                <p className="text-gray-500">

                  Achieved

                </p>

              </div>

            </div>

            <div className="mt-8 w-full space-y-5">

              <div className="flex justify-between">

                <span>Remaining</span>

                <span className="font-bold">

                  16%

                </span>

              </div>

              <div className="flex justify-between">

                <span>Days Left</span>

                <span className="font-bold">

                  12

                </span>

              </div>

              <div className="flex justify-between">

                <span>Expected Finish</span>

                <span className="font-bold text-green-600">

                  On Track

                </span>

              </div>

            </div>

          </div>

        </div>

      </div>
      {/* Team Performance & Territory Performance */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Team Target Performance */}

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-xl font-semibold">
              Team Target Performance
            </h2>

            <button className="text-blue-600 hover:underline">
              View All
            </button>

          </div>

          {[
            {
              name: "Rahul Sharma",
              sales: "₹54L",
              target: "₹60L",
              progress: 90,
            },
            {
              name: "Neha Verma",
              sales: "₹48L",
              target: "₹55L",
              progress: 87,
            },
            {
              name: "Amit Patel",
              sales: "₹42L",
              target: "₹50L",
              progress: 84,
            },
            {
              name: "Rohit Singh",
              sales: "₹36L",
              target: "₹45L",
              progress: 80,
            },
            {
              name: "Priya Jain",
              sales: "₹33L",
              target: "₹42L",
              progress: 78,
            },
          ].map((emp) => (

            <div
              key={emp.name}
              className="border-b last:border-0 py-5"
            >

              <div className="flex justify-between items-center mb-3">

                <div className="flex items-center gap-3">

                  <img
                    src={`https://ui-avatars.com/api/?name=${emp.name}`}
                    alt=""
                    className="w-12 h-12 rounded-full"
                  />

                  <div>

                    <h3 className="font-semibold">

                      {emp.name}

                    </h3>

                    <p className="text-sm text-gray-500">

                      {emp.sales} / {emp.target}

                    </p>

                  </div>

                </div>

                <span className="font-bold text-green-600">

                  {emp.progress}%

                </span>

              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">

                <div
                  className="bg-green-500 h-3 rounded-full"
                  style={{
                    width: `${emp.progress}%`,
                  }}
                />

              </div>

            </div>

          ))}

        </div>

        {/* Territory Performance */}

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-xl font-semibold">

              Territory Target

            </h2>

            <button className="text-blue-600 hover:underline">

              View All

            </button>

          </div>

          {[
            {
              city: "Bhopal",
              target: "₹70L",
              achieved: "₹66L",
              progress: 94,
            },
            {
              city: "Indore",
              target: "₹65L",
              achieved: "₹57L",
              progress: 88,
            },
            {
              city: "Jabalpur",
              target: "₹55L",
              achieved: "₹46L",
              progress: 84,
            },
            {
              city: "Gwalior",
              target: "₹48L",
              achieved: "₹38L",
              progress: 79,
            },
            {
              city: "Ujjain",
              target: "₹42L",
              achieved: "₹31L",
              progress: 74,
            },
          ].map((city) => (

            <div
              key={city.city}
              className="mb-6"
            >

              <div className="flex justify-between mb-2">

                <div>

                  <h3 className="font-semibold">

                    {city.city}

                  </h3>

                  <p className="text-sm text-gray-500">

                    {city.achieved} / {city.target}

                  </p>

                </div>

                <span className="font-semibold">

                  {city.progress}%

                </span>

              </div>

              <div className="bg-gray-200 rounded-full h-3">

                <div
                  className="bg-blue-600 h-3 rounded-full"
                  style={{
                    width: `${city.progress}%`,
                  }}
                />

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* Top Achievers */}

      <div className="bg-white rounded-2xl shadow-sm p-6">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-xl font-semibold">

            Top Achievers

          </h2>

          <button className="text-blue-600 hover:underline">

            View Leaderboard

          </button>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-4 text-left">Rank</th>
                <th className="p-4 text-left">Executive</th>
                <th className="p-4 text-left">Revenue</th>
                <th className="p-4 text-left">Orders</th>
                <th className="p-4 text-left">Achievement</th>
                <th className="p-4 text-left">Status</th>

              </tr>

            </thead>

            <tbody>

              {[
                {
                  rank: 1,
                  name: "Rahul Sharma",
                  revenue: "₹54L",
                  orders: 248,
                  achievement: "90%",
                  status: "Excellent",
                },
                {
                  rank: 2,
                  name: "Neha Verma",
                  revenue: "₹48L",
                  orders: 221,
                  achievement: "87%",
                  status: "Excellent",
                },
                {
                  rank: 3,
                  name: "Amit Patel",
                  revenue: "₹42L",
                  orders: 198,
                  achievement: "84%",
                  status: "Good",
                },
                {
                  rank: 4,
                  name: "Rohit Singh",
                  revenue: "₹36L",
                  orders: 181,
                  achievement: "80%",
                  status: "Good",
                },
              ].map((item) => (

                <tr
                  key={item.rank}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-4 font-bold">
                    #{item.rank}
                  </td>

                  <td className="p-4">
                    {item.name}
                  </td>

                  <td className="p-4 font-semibold text-green-600">
                    {item.revenue}
                  </td>

                  <td className="p-4">
                    {item.orders}
                  </td>

                  <td className="p-4">
                    {item.achievement}
                  </td>

                  <td className="p-4">

                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status === "Excellent"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}>

                      {item.status}

                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
            {/* Monthly Target Comparison & AI Recommendations */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Monthly Comparison */}

        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm p-6">

          <div className="flex justify-between items-center mb-6">

            <div>

              <h2 className="text-xl font-semibold">
                Monthly Target Comparison
              </h2>

              <p className="text-gray-500 text-sm">
                Achievement vs Target
              </p>

            </div>

            <button className="border px-4 py-2 rounded-lg hover:bg-gray-100">
              2026
            </button>

          </div>

          <div className="h-80 flex items-end gap-3">

            {[62,70,74,80,76,82,88,91,86,95,93,100].map((item,index)=>(

              <div
                key={index}
                className="flex-1 flex flex-col items-center"
              >

                <div
                  className="bg-linear-to-t from-blue-600 to-cyan-400 rounded-t-xl w-full"
                  style={{
                    height:`${item}%`
                  }}
                />

                <span className="text-xs mt-2 text-gray-500">
                  {
                    [
                      "Jan","Feb","Mar","Apr","May","Jun",
                      "Jul","Aug","Sep","Oct","Nov","Dec"
                    ][index]
                  }
                </span>

              </div>

            ))}

          </div>

        </div>

        {/* AI Suggestions */}

        <div className="bg-linear-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white">

          <h2 className="text-xl font-semibold mb-6">
            AI Recommendations
          </h2>

          <div className="space-y-5">

            <div className="bg-white/10 rounded-xl p-4">

              <h3 className="font-semibold mb-2">
                Revenue
              </h3>

              <p className="text-sm">
                Increase distributor visits by 15% to achieve monthly revenue target.
              </p>

            </div>

            <div className="bg-white/10 rounded-xl p-4">

              <h3 className="font-semibold mb-2">
                Customer Growth
              </h3>

              <p className="text-sm">
                Focus on Indore and Gwalior for acquiring new customers.
              </p>

            </div>

            <div className="bg-white/10 rounded-xl p-4">

              <h3 className="font-semibold mb-2">
                Executive Performance
              </h3>

              <p className="text-sm">
                Rahul Sharma is likely to exceed this month's target by 8%.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Target History */}

      <div className="bg-white rounded-2xl shadow-sm p-6">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-xl font-semibold">
            Target History
          </h2>

          <button className="text-blue-600 hover:underline">
            View Complete History
          </button>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-4 text-left">Month</th>
                <th className="p-4 text-left">Revenue Target</th>
                <th className="p-4 text-left">Achieved</th>
                <th className="p-4 text-left">Orders</th>
                <th className="p-4 text-left">Achievement</th>
                <th className="p-4 text-left">Status</th>

              </tr>

            </thead>

            <tbody>

              {[
                {
                  month:"January",
                  target:"₹2.2 Cr",
                  achieved:"₹2.05 Cr",
                  orders:1024,
                  progress:"93%",
                  status:"Completed"
                },
                {
                  month:"February",
                  target:"₹2.4 Cr",
                  achieved:"₹2.26 Cr",
                  orders:1098,
                  progress:"94%",
                  status:"Completed"
                },
                {
                  month:"March",
                  target:"₹2.6 Cr",
                  achieved:"₹2.42 Cr",
                  orders:1186,
                  progress:"93%",
                  status:"Completed"
                },
                {
                  month:"April",
                  target:"₹2.8 Cr",
                  achieved:"₹2.58 Cr",
                  orders:1238,
                  progress:"92%",
                  status:"Completed"
                },
                {
                  month:"May",
                  target:"₹3 Cr",
                  achieved:"₹2.48 Cr",
                  orders:1284,
                  progress:"84%",
                  status:"Running"
                }

              ].map((item,index)=>(

                <tr
                  key={index}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-4 font-medium">
                    {item.month}
                  </td>

                  <td className="p-4">
                    {item.target}
                  </td>

                  <td className="p-4 text-green-600 font-semibold">
                    {item.achieved}
                  </td>

                  <td className="p-4">
                    {item.orders}
                  </td>

                  <td className="p-4 font-semibold">
                    {item.progress}
                  </td>

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status==="Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
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

      {/* Pagination */}

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">

        <p className="text-gray-500">

          Showing 1–5 of 24 Records

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