import React, { useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Pencil,
  Package,
  ShoppingCart,
  DollarSign,
  Truck,
  TrendingUp,
  Plus,
} from "lucide-react";

const orders = [
  {
    id: "ORD1001",
    customer: "ABC Traders",
    executive: "Rahul Sharma",
    city: "Bhopal",
    amount: "₹45,000",
    payment: "Paid",
    status: "Delivered",
    date: "08 Jul 2026",
  },
  {
    id: "ORD1002",
    customer: "Royal Mart",
    executive: "Neha Verma",
    city: "Indore",
    amount: "₹22,800",
    payment: "Pending",
    status: "Processing",
    date: "07 Jul 2026",
  },
  {
    id: "ORD1003",
    customer: "Om Enterprises",
    executive: "Amit Patel",
    city: "Ujjain",
    amount: "₹18,400",
    payment: "Paid",
    status: "Delivered",
    date: "07 Jul 2026",
  },
  {
    id: "ORD1004",
    customer: "City Distributor",
    executive: "Rohit Singh",
    city: "Gwalior",
    amount: "₹58,600",
    payment: "Pending",
    status: "Pending",
    date: "06 Jul 2026",
  },
  {
    id: "ORD1005",
    customer: "Shree Agencies",
    executive: "Priya Jain",
    city: "Jabalpur",
    amount: "₹37,900",
    payment: "Paid",
    status: "Shipped",
    date: "06 Jul 2026",
  },
];

export default function SMOrders() {
  const [search, setSearch] = useState("");

  const filteredOrders = orders.filter(
    (order) =>
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.city.toLowerCase().includes(search.toLowerCase())
  );

  const paymentBadge = (payment) => {
    if (payment === "Paid") {
      return (
        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
          Paid
        </span>
      );
    }

    return (
      <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
        Pending
      </span>
    );
  };

  const statusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return (
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
            Delivered
          </span>
        );

      case "Processing":
        return (
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
            Processing
          </span>
        );

      case "Shipped":
        return (
          <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
            Shipped
          </span>
        );

      default:
        return (
          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
            Pending
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
            Orders
          </h1>

          <p className="text-gray-500">
            Track customer orders and delivery status.
          </p>

        </div>

        <button className="mt-4 lg:mt-0 flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700">

          <Plus size={18} />

          Create Order

        </button>

      </div>

      {/* KPI Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        <div className="bg-white rounded-2xl shadow p-6">

          <ShoppingCart className="text-blue-600" size={34} />

          <p className="text-gray-500 mt-4">
            Total Orders
          </p>

          <h2 className="text-3xl font-bold mt-2">
            1,284
          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow p-6">

          <DollarSign className="text-green-600" size={34} />

          <p className="text-gray-500 mt-4">
            Revenue
          </p>

          <h2 className="text-3xl font-bold mt-2">
            ₹2.48 Cr
          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow p-6">

          <Truck className="text-orange-500" size={34} />

          <p className="text-gray-500 mt-4">
            Delivered
          </p>

          <h2 className="text-3xl font-bold mt-2">
            1082
          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow p-6">

          <TrendingUp className="text-purple-600" size={34} />

          <p className="text-gray-500 mt-4">
            Monthly Growth
          </p>

          <h2 className="text-3xl font-bold mt-2">
            +18%
          </h2>

        </div>

      </div>

      {/* Search */}

      <div className="bg-white rounded-2xl shadow p-5">

        <div className="flex flex-col lg:flex-row gap-4">

          <div className="relative flex-1">

            <Search
              size={18}
              className="absolute left-3 top-3 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search Orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-lg py-2 pl-10 pr-4"
            />

          </div>

          <button className="border rounded-lg px-5 py-2 flex items-center gap-2">

            <Filter size={18} />

            Filter

          </button>

        </div>

      </div>
            {/* Orders Table */}

      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-4 text-left">Order ID</th>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Executive</th>
                <th className="p-4 text-left">City</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Payment</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-center">Actions</th>

              </tr>

            </thead>

            <tbody>

              {filteredOrders.map((order) => (

                <tr
                  key={order.id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-4 font-semibold">

                    {order.id}

                  </td>

                  <td className="p-4">

                    {order.customer}

                  </td>

                  <td className="p-4">

                    {order.executive}

                  </td>

                  <td className="p-4">

                    {order.city}

                  </td>

                  <td className="p-4 font-semibold text-green-600">

                    {order.amount}

                  </td>

                  <td className="p-4">

                    {paymentBadge(order.payment)}

                  </td>

                  <td className="p-4">

                    {statusBadge(order.status)}

                  </td>

                  <td className="p-4">

                    {order.date}

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

      {/* Order Summary */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Revenue Summary */}

        <div className="bg-white rounded-2xl shadow p-6">

          <h2 className="text-xl font-semibold mb-5">

            Revenue Summary

          </h2>

          <div className="space-y-5">

            <div className="flex justify-between">

              <span>Total Revenue</span>

              <span className="font-bold text-green-600">

                ₹2.48 Cr

              </span>

            </div>

            <div className="flex justify-between">

              <span>Received</span>

              <span className="font-bold text-blue-600">

                ₹2.15 Cr

              </span>

            </div>

            <div className="flex justify-between">

              <span>Pending</span>

              <span className="font-bold text-red-600">

                ₹33 Lakh

              </span>

            </div>

            <div className="flex justify-between">

              <span>Average Order</span>

              <span className="font-bold">

                ₹19,350

              </span>

            </div>

          </div>

        </div>

        {/* Delivery Status */}

        <div className="bg-white rounded-2xl shadow p-6">

          <h2 className="text-xl font-semibold mb-5">

            Delivery Status

          </h2>

          {[
            {
              title: "Delivered",
              value: 1082,
              color: "bg-green-500",
            },
            {
              title: "Processing",
              value: 112,
              color: "bg-blue-500",
            },
            {
              title: "Shipped",
              value: 58,
              color: "bg-yellow-500",
            },
            {
              title: "Pending",
              value: 32,
              color: "bg-gray-500",
            },
          ].map((item) => (

            <div
              key={item.title}
              className="mb-5"
            >

              <div className="flex justify-between mb-2">

                <span>

                  {item.title}

                </span>

                <span className="font-semibold">

                  {item.value}

                </span>

              </div>

              <div className="w-full h-3 rounded-full bg-gray-200">

                <div
                  className={`${item.color} h-3 rounded-full`}
                  style={{
                    width: `${(item.value / 1284) * 100}%`,
                  }}
                />

              </div>

            </div>

          ))}

        </div>

        {/* Payment Status */}

        <div className="bg-white rounded-2xl shadow p-6">

          <h2 className="text-xl font-semibold mb-5">

            Payment Status

          </h2>

          <div className="flex flex-col gap-6">

            <div className="flex justify-between items-center">

              <div>

                <p className="font-semibold">

                  Paid Orders

                </p>

                <p className="text-gray-500 text-sm">

                  Completed Payments

                </p>

              </div>

              <span className="text-green-600 text-2xl font-bold">

                91%

              </span>

            </div>

            <div className="flex justify-between items-center">

              <div>

                <p className="font-semibold">

                  Pending Payments

                </p>

                <p className="text-gray-500 text-sm">

                  Awaiting Collection

                </p>

              </div>

              <span className="text-red-600 text-2xl font-bold">

                9%

              </span>

            </div>

            <div className="w-full h-4 bg-gray-200 rounded-full">

              <div className="h-4 bg-green-500 rounded-full w-[91%]" />

            </div>

          </div>

        </div>

      </div>
            {/* Bottom Section */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Recent Order Activity */}

        <div className="bg-white rounded-2xl shadow p-6">

          <div className="flex justify-between items-center mb-5">

            <h2 className="text-xl font-semibold">
              Recent Activities
            </h2>

            <button className="text-blue-600 hover:underline">
              View All
            </button>

          </div>

          {[
            {
              customer: "ABC Traders",
              activity: "New Order Created",
              amount: "₹45,000",
              time: "10 min ago",
            },
            {
              customer: "Royal Mart",
              activity: "Payment Received",
              amount: "₹22,800",
              time: "35 min ago",
            },
            {
              customer: "Om Enterprises",
              activity: "Order Delivered",
              amount: "₹18,400",
              time: "1 hour ago",
            },
            {
              customer: "City Distributor",
              activity: "Order Processing",
              amount: "₹58,600",
              time: "Today",
            },
          ].map((item, index) => (

            <div
              key={index}
              className="border-b last:border-0 py-4 flex justify-between items-center"
            >

              <div>

                <h3 className="font-semibold">
                  {item.customer}
                </h3>

                <p className="text-sm text-gray-500">
                  {item.activity}
                </p>

              </div>

              <div className="text-right">

                <p className="font-semibold text-green-600">
                  {item.amount}
                </p>

                <p className="text-xs text-gray-400">
                  {item.time}
                </p>

              </div>

            </div>

          ))}

        </div>

        {/* Top Customers */}

        <div className="bg-white rounded-2xl shadow p-6">

          <h2 className="text-xl font-semibold mb-5">

            Top Customers

          </h2>

          {[
            {
              name: "ABC Traders",
              orders: 148,
              revenue: "₹18.2L",
            },
            {
              name: "Royal Mart",
              orders: 136,
              revenue: "₹16.8L",
            },
            {
              name: "Shree Agencies",
              orders: 124,
              revenue: "₹15.6L",
            },
            {
              name: "Om Enterprises",
              orders: 112,
              revenue: "₹14.4L",
            },
            {
              name: "City Distributor",
              orders: 96,
              revenue: "₹12.7L",
            },
          ].map((customer) => (

            <div
              key={customer.name}
              className="flex justify-between items-center border-b last:border-0 py-4"
            >

              <div>

                <h3 className="font-semibold">

                  {customer.name}

                </h3>

                <p className="text-sm text-gray-500">

                  {customer.orders} Orders

                </p>

              </div>

              <span className="font-bold text-green-600">

                {customer.revenue}

              </span>

            </div>

          ))}

        </div>

        {/* Monthly Statistics */}

        <div className="bg-white rounded-2xl shadow p-6">

          <h2 className="text-xl font-semibold mb-5">

            Monthly Statistics

          </h2>

          {[
            {
              title: "New Orders",
              value: 284,
              color: "bg-blue-500",
            },
            {
              title: "Delivered",
              value: 251,
              color: "bg-green-500",
            },
            {
              title: "Cancelled",
              value: 18,
              color: "bg-red-500",
            },
            {
              title: "Pending",
              value: 15,
              color: "bg-yellow-500",
            },
          ].map((item) => (

            <div key={item.title} className="mb-6">

              <div className="flex justify-between mb-2">

                <span>

                  {item.title}

                </span>

                <span className="font-semibold">

                  {item.value}

                </span>

              </div>

              <div className="w-full bg-gray-200 h-3 rounded-full">

                <div
                  className={`${item.color} h-3 rounded-full`}
                  style={{
                    width: `${(item.value / 284) * 100}%`,
                  }}
                />

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* Monthly Revenue Trend */}

      <div className="bg-white rounded-2xl shadow p-6">

        <div className="flex justify-between items-center mb-6">

          <div>

            <h2 className="text-xl font-semibold">
              Monthly Revenue Trend
            </h2>

            <p className="text-gray-500 text-sm">
              Revenue generated during the last 12 months
            </p>

          </div>

          <button className="border px-4 py-2 rounded-lg hover:bg-gray-100">

            Export

          </button>

        </div>

        <div className="h-72 flex items-end gap-3">

          {[42,55,61,74,68,80,72,91,86,95,90,100].map((value,index)=>(

            <div
              key={index}
              className="flex-1 flex flex-col items-center"
            >

              <div
                className="w-full rounded-t-xl bg-linear-to-t from-blue-600 to-cyan-400"
                style={{
                  height:`${value}%`
                }}
              />

              <span className="text-xs mt-2 text-gray-500">

                {
                  [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ][index]
                }

              </span>

            </div>

          ))}

        </div>

      </div>

      {/* Pagination */}

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">

        <p className="text-gray-500">

          Showing 1–5 of 1,284 Orders

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