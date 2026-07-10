import React from "react";
import {
  FileText,
  Download,
  Filter,
  Calendar,
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  BarChart3,
} from "lucide-react";

export default function SMReports() {

  const cards = [
    {
      title: "Revenue Report",
      value: "₹2.48 Cr",
      icon: DollarSign,
      color: "bg-green-500",
      growth: "+18%",
    },
    {
      title: "Orders Report",
      value: "1,284",
      icon: ShoppingCart,
      color: "bg-blue-500",
      growth: "+12%",
    },
    {
      title: "Customer Report",
      value: "682",
      icon: Users,
      color: "bg-purple-500",
      growth: "+9%",
    },
    {
      title: "Performance",
      value: "84%",
      icon: TrendingUp,
      color: "bg-orange-500",
      growth: "+5%",
    },
  ];

  return (

    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col lg:flex-row justify-between lg:items-center">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">

            Reports

          </h1>

          <p className="text-gray-500 mt-2">

            View and export business reports.

          </p>

        </div>

        <div className="flex gap-3 mt-5 lg:mt-0">

          <button className="border rounded-xl px-5 py-3 flex items-center gap-2 hover:bg-gray-100">

            <Calendar size={18}/>

            Date Range

          </button>

          <button className="border rounded-xl px-5 py-3 flex items-center gap-2 hover:bg-gray-100">

            <Filter size={18}/>

            Filters

          </button>

          <button className="bg-blue-600 text-white rounded-xl px-5 py-3 flex items-center gap-2 hover:bg-blue-700">

            <Download size={18}/>

            Export Report

          </button>

        </div>

      </div>

      {/* Summary Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {cards.map((card)=>{

          const Icon=card.icon;

          return(

            <div
              key={card.title}
              className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition"
            >

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-gray-500">

                    {card.title}

                  </p>

                  <h2 className="text-3xl font-bold mt-2">

                    {card.value}

                  </h2>

                </div>

                <div className={`${card.color} w-14 h-14 rounded-xl flex items-center justify-center text-white`}>

                  <Icon size={28}/>

                </div>

              </div>

              <p className="mt-5 text-green-600 font-semibold">

                {card.growth}

              </p>

            </div>

          )

        })}

      </div>

      {/* Report Analytics */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Revenue Report */}

        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm p-6">

          <div className="flex justify-between items-center mb-6">

            <div>

              <h2 className="text-xl font-semibold">

                Revenue Report

              </h2>

              <p className="text-gray-500 text-sm">

                Monthly Revenue Analysis

              </p>

            </div>

            <button className="border rounded-lg px-4 py-2">

              2026

            </button>

          </div>

          <div className="h-80 flex items-end gap-3">

            {[42,48,55,63,70,76,82,88,85,92,96,100].map((item,index)=>(

              <div
                key={index}
                className="flex-1 flex flex-col items-center"
              >

                <div
                  style={{
                    height:`${item}%`
                  }}
                  className="bg-linear-to-t from-blue-600 to-cyan-400 rounded-t-xl w-full"
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

        {/* Quick Reports */}

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <h2 className="text-xl font-semibold mb-6">

            Quick Reports

          </h2>

          {[
            "Daily Sales Report",
            "Weekly Sales Report",
            "Monthly Revenue Report",
            "Collection Report",
            "Pending Orders Report",
            "Executive Performance",
            "Customer Report",
            "Product Performance",
          ].map((report,index)=>(

            <button
              key={index}
              className="w-full mb-4 p-4 rounded-xl border hover:bg-blue-50 hover:border-blue-500 text-left flex justify-between items-center"
            >

              <span>

                {report}

              </span>

              <FileText size={20}/>

            </button>

          ))}

        </div>

      </div>
            {/* Executive Report & Territory Report */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Sales Executive Performance */}

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-xl font-semibold">
              Executive Performance
            </h2>

            <button className="text-blue-600 hover:underline">
              View All
            </button>

          </div>

          {[
            {
              name: "Rahul Sharma",
              revenue: "₹54L",
              orders: 248,
              progress: 94,
            },
            {
              name: "Neha Verma",
              revenue: "₹48L",
              orders: 221,
              progress: 90,
            },
            {
              name: "Amit Patel",
              revenue: "₹42L",
              orders: 198,
              progress: 84,
            },
            {
              name: "Rohit Singh",
              revenue: "₹36L",
              orders: 176,
              progress: 78,
            },
          ].map((item) => (

            <div
              key={item.name}
              className="border-b last:border-0 py-5"
            >

              <div className="flex justify-between items-center mb-3">

                <div className="flex items-center gap-3">

                  <img
                    src={`https://ui-avatars.com/api/?name=${item.name}`}
                    alt=""
                    className="w-12 h-12 rounded-full"
                  />

                  <div>

                    <h3 className="font-semibold">
                      {item.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {item.orders} Orders
                    </p>

                  </div>

                </div>

                <span className="font-bold text-green-600">
                  {item.revenue}
                </span>

              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">

                <div
                  className="bg-green-500 h-3 rounded-full"
                  style={{
                    width: `${item.progress}%`,
                  }}
                />

              </div>

            </div>

          ))}

        </div>

        {/* Territory Report */}

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-xl font-semibold">
              Territory Performance
            </h2>

            <button className="text-blue-600 hover:underline">
              View All
            </button>

          </div>

          {[
            {
              city: "Bhopal",
              revenue: "₹66L",
              progress: 95,
            },
            {
              city: "Indore",
              revenue: "₹58L",
              progress: 88,
            },
            {
              city: "Jabalpur",
              revenue: "₹49L",
              progress: 81,
            },
            {
              city: "Gwalior",
              revenue: "₹41L",
              progress: 76,
            },
            {
              city: "Ujjain",
              revenue: "₹34L",
              progress: 68,
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
                    {city.revenue}
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

      {/* Product Report & Revenue Breakdown */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Product Performance */}

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <h2 className="text-xl font-semibold mb-6">
            Product Performance
          </h2>

          {[
            {
              product: "Premium Cement",
              revenue: "₹48L",
              progress: 95,
            },
            {
              product: "Ultra Steel",
              revenue: "₹43L",
              progress: 88,
            },
            {
              product: "Concrete Blocks",
              revenue: "₹36L",
              progress: 80,
            },
            {
              product: "Construction Sand",
              revenue: "₹28L",
              progress: 72,
            },
          ].map((item) => (

            <div
              key={item.product}
              className="mb-6"
            >

              <div className="flex justify-between mb-2">

                <div>

                  <h3 className="font-semibold">
                    {item.product}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {item.revenue}
                  </p>

                </div>

                <span className="font-semibold">
                  {item.progress}%
                </span>

              </div>

              <div className="bg-gray-200 rounded-full h-3">

                <div
                  className="bg-indigo-600 h-3 rounded-full"
                  style={{
                    width: `${item.progress}%`,
                  }}
                />

              </div>

            </div>

          ))}

        </div>

        {/* Revenue Breakdown */}

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <h2 className="text-xl font-semibold mb-6">
            Revenue Breakdown
          </h2>

          {[
            {
              title: "Retail Sales",
              amount: "₹82L",
              color: "bg-blue-600",
              progress: 82,
            },
            {
              title: "Wholesale",
              amount: "₹64L",
              color: "bg-green-500",
              progress: 64,
            },
            {
              title: "Distributor",
              amount: "₹51L",
              color: "bg-purple-500",
              progress: 51,
            },
            {
              title: "Corporate",
              amount: "₹38L",
              color: "bg-orange-500",
              progress: 38,
            },
          ].map((item) => (

            <div
              key={item.title}
              className="mb-6"
            >

              <div className="flex justify-between mb-2">

                <span className="font-medium">
                  {item.title}
                </span>

                <span className="font-semibold">
                  {item.amount}
                </span>

              </div>

              <div className="bg-gray-200 rounded-full h-3">

                <div
                  className={`${item.color} h-3 rounded-full`}
                  style={{
                    width: `${item.progress}%`,
                  }}
                />

              </div>

            </div>

          ))}

        </div>

      </div>
            {/* AI Insights & Report Statistics */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Recent Generated Reports */}

        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm p-6">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-xl font-semibold">

              Recently Generated Reports

            </h2>

            <button className="text-blue-600 hover:underline">

              View All

            </button>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-100">

                <tr>

                  <th className="p-4 text-left">Report</th>
                  <th className="p-4 text-left">Generated By</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Format</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-center">Action</th>

                </tr>

              </thead>

              <tbody>

                {[
                  {
                    report: "Monthly Revenue",
                    user: "Sales Manager",
                    date: "08 Jul 2026",
                    format: "PDF",
                    status: "Ready",
                  },
                  {
                    report: "Executive Report",
                    user: "Rahul Sharma",
                    date: "08 Jul 2026",
                    format: "Excel",
                    status: "Ready",
                  },
                  {
                    report: "Customer Report",
                    user: "System",
                    date: "07 Jul 2026",
                    format: "PDF",
                    status: "Ready",
                  },
                  {
                    report: "Collection Report",
                    user: "Finance",
                    date: "07 Jul 2026",
                    format: "Excel",
                    status: "Processing",
                  },
                  {
                    report: "Target Report",
                    user: "Sales Head",
                    date: "06 Jul 2026",
                    format: "PDF",
                    status: "Ready",
                  },
                ].map((item, index) => (

                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="p-4 font-medium">

                      {item.report}

                    </td>

                    <td className="p-4">

                      {item.user}

                    </td>

                    <td className="p-4">

                      {item.date}

                    </td>

                    <td className="p-4">

                      {item.format}

                    </td>

                    <td className="p-4">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.status === "Ready"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >

                        {item.status}

                      </span>

                    </td>

                    <td className="p-4 text-center">

                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">

                        Download

                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

        {/* AI Report Insights */}

        <div className="bg-linear-to-br from-blue-600 to-indigo-700 text-white rounded-2xl shadow-sm p-6">

          <h2 className="text-xl font-semibold mb-6">

            AI Report Insights

          </h2>

          <div className="space-y-5">

            <div className="bg-white/10 rounded-xl p-4">

              <h3 className="font-semibold mb-2">

                Revenue Trend

              </h3>

              <p className="text-sm">

                Revenue is projected to increase by
                <strong> 15% </strong>
                next month.

              </p>

            </div>

            <div className="bg-white/10 rounded-xl p-4">

              <h3 className="font-semibold mb-2">

                Best Executive

              </h3>

              <p className="text-sm">

                Rahul Sharma exceeded his sales target by
                <strong> 9%.</strong>

              </p>

            </div>

            <div className="bg-white/10 rounded-xl p-4">

              <h3 className="font-semibold mb-2">

                Recommendation

              </h3>

              <p className="text-sm">

                Increase marketing in Gwalior and Ujjain to improve sales.

              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Report Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="bg-green-50 rounded-2xl p-6">

          <BarChart3
            className="text-green-600 mb-4"
            size={32}
          />

          <p className="text-green-600">

            Reports Generated

          </p>

          <h2 className="text-3xl font-bold mt-2">

            426

          </h2>

        </div>

        <div className="bg-blue-50 rounded-2xl p-6">

          <Download
            className="text-blue-600 mb-4"
            size={32}
          />

          <p className="text-blue-600">

            Downloads

          </p>

          <h2 className="text-3xl font-bold mt-2">

            982

          </h2>

        </div>

        <div className="bg-purple-50 rounded-2xl p-6">

          <FileText
            className="text-purple-600 mb-4"
            size={32}
          />

          <p className="text-purple-600">

            Custom Reports

          </p>

          <h2 className="text-3xl font-bold mt-2">

            68

          </h2>

        </div>

        <div className="bg-orange-50 rounded-2xl p-6">

          <TrendingUp
            className="text-orange-600 mb-4"
            size={32}
          />

          <p className="text-orange-600">

            Accuracy

          </p>

          <h2 className="text-3xl font-bold mt-2">

            98%

          </h2>

        </div>

      </div>

      {/* Pagination */}

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">

        <p className="text-gray-500">

          Showing 1–5 of 426 Reports

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