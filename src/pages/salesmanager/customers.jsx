import { useState } from "react";
import {
  FaUserPlus,
  FaSearch,
  FaFilter,
  FaUsers,
  FaBuilding,
  FaFileExport,
  FaDownload,
  FaStar,
} from "react-icons/fa";

export default function SMCustomers() {
  const [search, setSearch] = useState("");

  const customers = [
    {
      id: "CUS001",
      name: "ABC Traders",
      company: "ABC Traders Pvt Ltd",
      territory: "Indore",
      salesperson: "Rahul Sharma",
      phone: "+91 9876543210",
      revenue: "₹14,50,000",
      orders: 42,
      lastVisit: "05 Jul 2026",
      status: "Active",
    },
    {
      id: "CUS002",
      name: "Modern Retail",
      company: "Modern Retail Ltd",
      territory: "Bhopal",
      salesperson: "Neha Singh",
      phone: "+91 9876543211",
      revenue: "₹10,25,000",
      orders: 28,
      lastVisit: "04 Jul 2026",
      status: "Active",
    },
    {
      id: "CUS003",
      name: "Sai Distributor",
      company: "Sai Distributor",
      territory: "Ujjain",
      salesperson: "Amit Verma",
      phone: "+91 9876543212",
      revenue: "₹8,90,000",
      orders: 21,
      lastVisit: "02 Jul 2026",
      status: "Inactive",
    },
    {
      id: "CUS004",
      name: "Global Pharma",
      company: "Global Pharma",
      territory: "Dewas",
      salesperson: "Priya Jain",
      phone: "+91 9876543213",
      revenue: "₹17,80,000",
      orders: 51,
      lastVisit: "06 Jul 2026",
      status: "VIP",
    },
  ];

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.company.toLowerCase().includes(search.toLowerCase()) ||
      customer.territory.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">Customers</h1>

          <p className="text-gray-500 mt-2">
            Manage customer information, revenue and relationships.
          </p>
        </div>

        <div className="flex gap-3 mt-5 lg:mt-0">
          <button className="border rounded-xl px-5 py-3 flex items-center gap-2 hover:bg-gray-100">
            <FaDownload />
            Export
          </button>

          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-700">
            <FaUserPlus />
            Add Customer
          </button>
        </div>
      </div>

      {/* Summary Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">Total Customers</p>

              <h2 className="text-3xl font-bold mt-2">1,248</h2>
            </div>

            <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
              <FaUsers className="text-blue-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">Active Customers</p>

              <h2 className="text-3xl font-bold mt-2">1,120</h2>
            </div>

            <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
              <FaBuilding className="text-green-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">New Customers</p>

              <h2 className="text-3xl font-bold mt-2">86</h2>
            </div>

            <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center">
              <FaUserPlus className="text-orange-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">VIP Customers</p>

              <h2 className="text-3xl font-bold mt-2">54</h2>
            </div>

            <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center">
              <FaStar className="text-purple-600 text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}

      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <div className="relative lg:w-96">
            <FaSearch className="absolute left-4 top-4 text-gray-400" />

            <input
              type="text"
              placeholder="Search customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3">
            <select className="border rounded-xl px-5 py-3">
              <option>All Territories</option>
              <option>Indore</option>
              <option>Bhopal</option>
              <option>Ujjain</option>
              <option>Dewas</option>
            </select>

            <button className="border rounded-xl px-5 py-3 flex items-center gap-2 hover:bg-gray-100">
              <FaFilter />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Customer Table */}

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b">
          <h2 className="text-xl font-semibold">Customer List</h2>

          <p className="text-sm text-gray-500 mt-1">
            View and manage all assigned customers.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left">Customer</th>

                <th className="px-6 py-4 text-left">Territory</th>

                <th className="px-6 py-4 text-left">Salesperson</th>

                <th className="px-6 py-4 text-left">Revenue</th>

                <th className="px-6 py-4 text-left">Orders</th>

                <th className="px-6 py-4 text-left">Status</th>

                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {" "}
              {filteredCustomers.map((customer, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {/* Customer */}

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                        {customer.name.charAt(0)}
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {customer.name}
                        </h3>

                        <p className="text-sm text-gray-500">
                          {customer.company}
                        </p>

                        <p className="text-xs text-gray-400">
                          {customer.phone}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Territory */}

                  <td className="px-6 py-5">{customer.territory}</td>

                  {/* Salesperson */}

                  <td className="px-6 py-5">{customer.salesperson}</td>

                  {/* Revenue */}

                  <td className="px-6 py-5 font-semibold text-green-600">
                    {customer.revenue}
                  </td>

                  {/* Orders */}

                  <td className="px-6 py-5">{customer.orders}</td>

                  {/* Status */}

                  <td className="px-6 py-5">
                    <span
                      className={`px-4 py-2 rounded-full text-xs font-semibold ${
                        customer.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : customer.status === "VIP"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>

                  {/* Actions */}

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
          Showing 1 to {filteredCustomers.length} of {customers.length}{" "}
          customers
        </p>

        <div className="flex gap-2 mt-4 lg:mt-0">
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">
            Previous
          </button>

          <button className="px-4 py-2 rounded-lg bg-blue-600 text-white">
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

      {/* Customer Statistics */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue */}

        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-6">Revenue Distribution</h2>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between mb-2">
                <span>Retail</span>

                <span>45%</span>
              </div>

              <div className="bg-gray-200 rounded-full h-3">
                <div className="bg-blue-600 h-3 rounded-full w-[45%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span>Wholesale</span>

                <span>30%</span>
              </div>

              <div className="bg-gray-200 rounded-full h-3">
                <div className="bg-green-500 h-3 rounded-full w-[30%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span>Distributor</span>

                <span>25%</span>
              </div>

              <div className="bg-gray-200 rounded-full h-3">
                <div className="bg-orange-500 h-3 rounded-full w-[25%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Customer */}

        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-6">Top Customer</h2>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-700 text-2xl">
              A
            </div>

            <div>
              <h3 className="font-semibold text-lg">ABC Traders</h3>

              <p className="text-gray-500">₹14.5 Lakhs Revenue</p>

              <p className="text-sm text-green-600 mt-1">
                Highest Revenue This Month
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}

        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-6">Recent Activity</h2>

          <div className="space-y-4">
            <div className="border-l-4 border-blue-600 pl-4">
              <h4 className="font-medium">New Order Received</h4>

              <p className="text-sm text-gray-500">
                ABC Traders placed an order worth ₹58,000.
              </p>
            </div>

            <div className="border-l-4 border-green-600 pl-4">
              <h4 className="font-medium">Customer Visit</h4>

              <p className="text-sm text-gray-500">
                Rahul Sharma completed a visit to Global Pharma.
              </p>
            </div>

            <div className="border-l-4 border-orange-500 pl-4">
              <h4 className="font-medium">Payment Received</h4>

              <p className="text-sm text-gray-500">
                Modern Retail cleared outstanding payment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
