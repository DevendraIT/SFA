// src/pages/headsales/Customers.jsx

import React, { useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Pencil,
  Users,
  UserPlus,
  Crown,
  TrendingUp,
} from "lucide-react";

const customers = [
  {
    id: "CUST001",
    name: "ABC Traders",
    contact: "9876543210",
    city: "Bhopal",
    segment: "Platinum",
    revenue: "₹4,50,000",
    lastVisit: "06 Jul 2026",
  },
  {
    id: "CUST002",
    name: "Shree Agencies",
    contact: "9876501234",
    city: "Indore",
    segment: "Gold",
    revenue: "₹3,20,000",
    lastVisit: "05 Jul 2026",
  },
  {
    id: "CUST003",
    name: "Royal Mart",
    contact: "9988776655",
    city: "Jabalpur",
    segment: "Silver",
    revenue: "₹1,85,000",
    lastVisit: "04 Jul 2026",
  },
  {
    id: "CUST004",
    name: "City Distributors",
    contact: "9898989898",
    city: "Gwalior",
    segment: "Gold",
    revenue: "₹2,60,000",
    lastVisit: "03 Jul 2026",
  },
  {
    id: "CUST005",
    name: "Om Enterprises",
    contact: "9000011111",
    city: "Ujjain",
    segment: "Platinum",
    revenue: "₹5,10,000",
    lastVisit: "02 Jul 2026",
  },
];

export default function HOSCustomers() {
  const [search, setSearch] = useState("");

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.city.toLowerCase().includes(search.toLowerCase()) ||
      customer.id.toLowerCase().includes(search.toLowerCase())
  );

  const segmentBadge = (segment) => {
    switch (segment) {
      case "Platinum":
        return (
          <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
            Platinum
          </span>
        );
      case "Gold":
        return (
          <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
            Gold
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
            Silver
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Customers
          </h1>
          <p className="text-gray-500">
            Manage and monitor customer relationships.
          </p>
        </div>

        <button className="mt-4 lg:mt-0 flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
          <UserPlus size={18} />
          Add Customer
        </button>

      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        <div className="bg-white rounded-xl shadow p-5">
          <Users className="text-blue-600" size={30} />
          <p className="text-gray-500 mt-3">Total Customers</p>
          <h2 className="text-3xl font-bold">682</h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <TrendingUp className="text-green-600" size={30} />
          <p className="text-gray-500 mt-3">New This Month</p>
          <h2 className="text-3xl font-bold">46</h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <Crown className="text-yellow-500" size={30} />
          <p className="text-gray-500 mt-3">Premium Customers</p>
          <h2 className="text-3xl font-bold">118</h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <TrendingUp className="text-purple-600" size={30} />
          <p className="text-gray-500 mt-3">Customer Growth</p>
          <h2 className="text-3xl font-bold">+18%</h2>
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
              placeholder="Search customers..."
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

      {/* Customer Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-4 text-left">Customer ID</th>
                <th className="p-4 text-left">Customer Name</th>
                <th className="p-4 text-left">Contact</th>
                <th className="p-4 text-left">City</th>
                <th className="p-4 text-left">Segment</th>
                <th className="p-4 text-left">Revenue</th>
                <th className="p-4 text-left">Last Visit</th>
                <th className="p-4 text-center">Actions</th>

              </tr>

            </thead>

            <tbody>

              {filteredCustomers.map((customer) => (

                <tr
                  key={customer.id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="p-4 font-medium">
                    {customer.id}
                  </td>

                  <td className="p-4">
                    {customer.name}
                  </td>

                  <td className="p-4">
                    {customer.contact}
                  </td>

                  <td className="p-4">
                    {customer.city}
                  </td>

                  <td className="p-4">
                    {segmentBadge(customer.segment)}
                  </td>

                  <td className="p-4 font-semibold">
                    {customer.revenue}
                  </td>

                  <td className="p-4">
                    {customer.lastVisit}
                  </td>

                  <td className="p-4">
                    <div className="flex justify-center gap-3">

                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye size={18} />
                      </button>

                      <button className="text-green-600 hover:text-green-800">
                        <Pencil size={18} />
                      </button>

                    </div>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
      {/* Bottom Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Top Customers */}
        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-5">
            ⭐ Top Customers
          </h2>

          {[
            {
              name: "ABC Traders",
              revenue: "₹4.5L",
              city: "Bhopal",
            },
            {
              name: "Om Enterprises",
              revenue: "₹5.1L",
              city: "Ujjain",
            },
            {
              name: "Royal Mart",
              revenue: "₹3.9L",
              city: "Indore",
            },
            {
              name: "City Distributors",
              revenue: "₹3.2L",
              city: "Gwalior",
            },
          ].map((customer, index) => (

            <div
              key={index}
              className="flex justify-between items-center py-3 border-b last:border-0"
            >

              <div>

                <p className="font-semibold">
                  {customer.name}
                </p>

                <p className="text-sm text-gray-500">
                  {customer.city}
                </p>

              </div>

              <span className="font-bold text-green-600">
                {customer.revenue}
              </span>

            </div>

          ))}

        </div>

        {/* Customer Segments */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-5">
            Customer Segments
          </h2>

          {[
            {
              segment: "Platinum",
              count: 118,
              color: "bg-purple-600",
            },
            {
              segment: "Gold",
              count: 242,
              color: "bg-yellow-500",
            },
            {
              segment: "Silver",
              count: 322,
              color: "bg-gray-500",
            },
          ].map((item) => (

            <div key={item.segment} className="mb-5">

              <div className="flex justify-between mb-2">

                <span>{item.segment}</span>

                <span className="font-semibold">
                  {item.count}
                </span>

              </div>

              <div className="w-full bg-gray-200 h-3 rounded-full">

                <div
                  className={`${item.color} h-3 rounded-full`}
                  style={{
                    width: `${(item.count / 682) * 100}%`,
                  }}
                />

              </div>

            </div>

          ))}

        </div>

        {/* Customer Details */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-5">
            Customer Details
          </h2>

          <div className="flex flex-col items-center">

            <img
              src="https://ui-avatars.com/api/?name=ABC+Traders"
              alt="Customer"
              className="w-20 h-20 rounded-full"
            />

            <h3 className="font-bold text-lg mt-4">
              ABC Traders
            </h3>

            <p className="text-gray-500">
              Bhopal
            </p>

            <div className="mt-5 space-y-3 w-full">

              <div className="flex justify-between">
                <span>Total Orders</span>
                <span className="font-semibold">
                  246
                </span>
              </div>

              <div className="flex justify-between">
                <span>Total Revenue</span>
                <span className="font-semibold">
                  ₹4.5L
                </span>
              </div>

              <div className="flex justify-between">
                <span>Last Visit</span>
                <span className="font-semibold">
                  06 Jul
                </span>
              </div>

              <div className="flex justify-between">
                <span>Assigned Manager</span>
                <span className="font-semibold">
                  Rahul Sharma
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Visit History */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-semibold mb-5">
          Customer Visit History
        </h2>

        <div className="space-y-4">

          {[
            {
              date: "06 Jul 2026",
              executive: "Rahul Sharma",
              remark: "Collected new order worth ₹45,000",
            },
            {
              date: "28 Jun 2026",
              executive: "Rahul Sharma",
              remark: "Payment Follow-up",
            },
            {
              date: "15 Jun 2026",
              executive: "Rahul Sharma",
              remark: "Product Demo",
            },
            {
              date: "02 Jun 2026",
              executive: "Rahul Sharma",
              remark: "New Customer Meeting",
            },
          ].map((visit, index) => (

            <div
              key={index}
              className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50"
            >

              <div>

                <p className="font-semibold">
                  {visit.date}
                </p>

                <p className="text-sm text-gray-500">
                  {visit.executive}
                </p>

              </div>

              <p className="text-gray-700">
                {visit.remark}
              </p>

            </div>

          ))}

        </div>

      </div>

      {/* Pagination */}

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">

        <p className="text-gray-500">
          Showing 1–5 of 682 customers
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
