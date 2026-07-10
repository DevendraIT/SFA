import React, { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Truck,
} from "lucide-react";

const orderData = [
  {
    id: "ORD1001",
    customer: "ABC Traders",
    salesPerson: "Rahul Sharma",
    amount: "₹24,500",
    status: "Pending",
    date: "08 Jul 2026",
  },
  {
    id: "ORD1002",
    customer: "Shree Distributors",
    salesPerson: "Amit Patel",
    amount: "₹52,300",
    status: "Approved",
    date: "08 Jul 2026",
  },
  {
    id: "ORD1003",
    customer: "City Mart",
    salesPerson: "Neha Singh",
    amount: "₹16,800",
    status: "Delivered",
    date: "07 Jul 2026",
  },
  {
    id: "ORD1004",
    customer: "Om Enterprises",
    salesPerson: "Vikas Jain",
    amount: "₹11,250",
    status: "Cancelled",
    date: "07 Jul 2026",
  },
  {
    id: "ORD1005",
    customer: "Royal Agencies",
    salesPerson: "Rakesh Verma",
    amount: "₹38,900",
    status: "Approved",
    date: "06 Jul 2026",
  },
];

export default function HOSOrders() {
  const [search, setSearch] = useState("");

  const filteredOrders = orderData.filter(
    (order) =>
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toLowerCase().includes(search.toLowerCase())
  );

  const statusBadge = (status) => {
    switch (status) {
      case "Pending":
        return (
          <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
            <Clock size={14} />
            Pending
          </span>
        );

      case "Approved":
        return (
          <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
            <CheckCircle size={14} />
            Approved
          </span>
        );

      case "Delivered":
        return (
          <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
            <Truck size={14} />
            Delivered
          </span>
        );

      default:
        return (
          <span className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">
            <XCircle size={14} />
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Orders
          </h1>

          <p className="text-gray-500">
            Manage and monitor all customer orders.
          </p>
        </div>

        <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
          <Download size={18} />
          Export Orders
        </button>

      </div>

      {/* Summary Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500">Pending Orders</p>
          <h2 className="text-3xl font-bold mt-2">28</h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500">Approved</p>
          <h2 className="text-3xl font-bold mt-2">134</h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500">Delivered</p>
          <h2 className="text-3xl font-bold mt-2">872</h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500">Cancelled</p>
          <h2 className="text-3xl font-bold mt-2">16</h2>
        </div>

      </div>

      {/* Search & Filter */}

      <div className="bg-white rounded-xl shadow p-5">

        <div className="flex flex-col lg:flex-row gap-4">

          <div className="relative flex-1">

            <Search
              className="absolute left-3 top-3 text-gray-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Search Order ID or Customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-lg pl-10 pr-4 py-2"
            />

          </div>

          <button className="flex items-center gap-2 border rounded-lg px-4 py-2">
            <Filter size={18} />
            Filter
          </button>

        </div>

      </div>

      {/* Orders Table */}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-4 text-left">Order ID</th>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Sales Person</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-center">Action</th>

              </tr>

            </thead>

            <tbody>

              {filteredOrders.map((order) => (

                <tr
                  key={order.id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="p-4 font-medium">
                    {order.id}
                  </td>

                  <td className="p-4">
                    {order.customer}
                  </td>

                  <td className="p-4">
                    {order.salesPerson}
                  </td>

                  <td className="p-4 font-semibold">
                    {order.amount}
                  </td>

                  <td className="p-4">
                    {order.date}
                  </td>

                  <td className="p-4">
                    {statusBadge(order.status)}
                  </td>

                  <td className="p-4 text-center">

                    <button className="text-blue-600 hover:text-blue-800">
                      <Eye size={20} />
                    </button>

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
          Showing 1 - {filteredOrders.length} of {orderData.length} Orders
        </p>

        <div className="flex gap-2">

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
            Next
          </button>

        </div>

      </div>

    </div>
  );
}