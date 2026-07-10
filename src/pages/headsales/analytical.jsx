// src/pages/headsales/Analytics.jsx

import React from "react";
import {
  TrendingUp,
  DollarSign,
  Users,
  ShoppingCart,
  Filter,
  Download,
} from "lucide-react";

const revenueData = [
  { month: "Jan", revenue: "₹8.2L", growth: "+12%" },
  { month: "Feb", revenue: "₹9.5L", growth: "+15%" },
  { month: "Mar", revenue: "₹11.3L", growth: "+18%" },
  { month: "Apr", revenue: "₹12.7L", growth: "+10%" },
  { month: "May", revenue: "₹14.4L", growth: "+13%" },
  { month: "Jun", revenue: "₹16.2L", growth: "+16%" },
];

const regions = [
  { name: "North", sales: "₹5.8L", progress: 90 },
  { name: "South", sales: "₹4.2L", progress: 74 },
  { name: "East", sales: "₹3.5L", progress: 65 },
  { name: "West", sales: "₹6.1L", progress: 96 },
];

const products = [
  { name: "Product A", sales: 420 },
  { name: "Product B", sales: 365 },
  { name: "Product C", sales: 290 },
  { name: "Product D", sales: 180 },
];

export default function HOSAnalytics() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Sales Analytics
          </h1>

          <p className="text-gray-500 mt-1">
            Revenue insights and sales performance
          </p>
        </div>

        <div className="flex gap-3 mt-4 md:mt-0">

          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow">
            <Filter size={18} />
            Filters
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow">
            <Download size={18} />
            Export
          </button>

        </div>

      </div>

      {/* KPI Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <div className="bg-white rounded-xl shadow p-5">
          <DollarSign className="text-green-600" size={30} />
          <h2 className="text-gray-500 mt-3">Revenue</h2>
          <p className="text-3xl font-bold mt-2">₹58.4L</p>
          <span className="text-green-600 text-sm">+18%</span>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <ShoppingCart className="text-blue-600" size={30} />
          <h2 className="text-gray-500 mt-3">Orders</h2>
          <p className="text-3xl font-bold mt-2">1,842</p>
          <span className="text-green-600 text-sm">+9%</span>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <Users className="text-purple-600" size={30} />
          <h2 className="text-gray-500 mt-3">Customers</h2>
          <p className="text-3xl font-bold mt-2">682</p>
          <span className="text-green-600 text-sm">+7%</span>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <TrendingUp className="text-red-500" size={30} />
          <h2 className="text-gray-500 mt-3">Conversion</h2>
          <p className="text-3xl font-bold mt-2">72%</p>
          <span className="text-green-600 text-sm">+5%</span>
        </div>

      </div>

      {/* Revenue Table */}

      <div className="bg-white rounded-xl shadow mt-8 p-6">

        <h2 className="text-xl font-semibold mb-4">
          Monthly Revenue
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left py-3">Month</th>
                <th className="text-left py-3">Revenue</th>
                <th className="text-left py-3">Growth</th>

              </tr>

            </thead>

            <tbody>

              {revenueData.map((item) => (
                <tr
                  key={item.month}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="py-4">{item.month}</td>
                  <td>{item.revenue}</td>
                  <td className="text-green-600 font-semibold">
                    {item.growth}
                  </td>
                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* Region Performance */}

      <div className="grid lg:grid-cols-2 gap-6 mt-8">

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-5">
            Region Performance
          </h2>

          {regions.map((region) => (
            <div key={region.name} className="mb-5">

              <div className="flex justify-between mb-2">

                <span>{region.name}</span>

                <span className="font-semibold">
                  {region.sales}
                </span>

              </div>

              <div className="w-full h-3 bg-gray-200 rounded-full">

                <div
                  className="h-3 rounded-full bg-blue-600"
                  style={{ width: `${region.progress}%` }}
                />

              </div>

            </div>
          ))}

        </div>

        {/* Product Performance */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-5">
            Product Performance
          </h2>

          {products.map((product) => (

            <div
              key={product.name}
              className="flex justify-between py-3 border-b"
            >
              <span>{product.name}</span>

              <span className="font-semibold">
                {product.sales} Units
              </span>

            </div>

          ))}

        </div>

      </div>

      {/* AI Forecast */}

      <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow mt-8 p-6">

        <h2 className="text-2xl font-bold">
          AI Revenue Forecast
        </h2>

        <p className="mt-4 text-blue-100">
          Predicted revenue for next month is
          <span className="font-bold text-white">
            {" "}₹18.5L
          </span>
          , with an estimated growth of
          <span className="font-bold text-white">
            {" "}14%
          </span>.
        </p>

        <button className="mt-6 bg-white text-blue-600 px-5 py-2 rounded-lg font-semibold">
          View Detailed Forecast
        </button>

      </div>

    </div>
  );
}