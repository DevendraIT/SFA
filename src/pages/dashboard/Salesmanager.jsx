import {
  DollarSign,
  ShoppingCart,
  Users,
  Target,
  TrendingUp,
  Calendar,
  Plus,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const cards = [
  {
    title: "Total Revenue",
    value: "₹2.48 Cr",
    growth: "+18.4%",
    icon: DollarSign,
    color: "bg-green-500",
    trend: "up",
  },
  {
    title: "Orders",
    value: "1,284",
    growth: "+12.8%",
    icon: ShoppingCart,
    color: "bg-blue-500",
    trend: "up",
  },
  {
    title: "Customers",
    value: "682",
    growth: "+8.2%",
    icon: Users,
    color: "bg-purple-500",
    trend: "up",
  },
  {
    title: "Target Achievement",
    value: "84%",
    growth: "-2%",
    icon: Target,
    color: "bg-orange-500",
    trend: "down",
  },
  {
    title: "Conversion Rate",
    value: "72%",
    growth: "+4.6%",
    icon: TrendingUp,
    color: "bg-cyan-500",
    trend: "up",
  },
  {
    title: "Today's Visits",
    value: "26",
    growth: "+6",
    icon: Calendar,
    color: "bg-pink-500",
    trend: "up",
  },
];

const quickActions = [
  "Create Order",
  "Add Customer",
  "Assign Visit",
  "Generate Report",
];
export default function SalesManagerDashboard() {
  return (
    <div className="space-y-7">

      {/* Header */}

      <div className="flex flex-col lg:flex-row justify-between lg:items-center">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">

            Welcome Back, Rahul 👋

          </h1>

          <p className="text-gray-500 mt-2">

            Here's what's happening in your sales region today.

          </p>

        </div>

        <div className="flex gap-3 mt-5 lg:mt-0">

          <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700">

            <Plus size={18} />

            New Order

          </button>

          <button className="flex items-center gap-2 border px-5 py-3 rounded-xl hover:bg-gray-100">

            <Eye size={18} />

            View Reports

          </button>

        </div>

      </div>

      {/* KPI Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {cards.map((card) => {

          const Icon = card.icon;

          return (

            <div
              key={card.title}
              className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all"
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

                <div
                  className={`${card.color} w-14 h-14 rounded-xl flex items-center justify-center text-white`}
                >

                  <Icon size={28} />

                </div>

              </div>

              <div className="mt-6 flex items-center gap-2">

                {card.trend === "up" ? (

                  <ArrowUpRight
                    className="text-green-600"
                    size={18}
                  />

                ) : (

                  <ArrowDownRight
                    className="text-red-600"
                    size={18}
                  />

                )}

                <span
                  className={`font-semibold ${
                    card.trend === "up"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {card.growth}
                </span>

                <span className="text-gray-400">

                  vs last month

                </span>

              </div>

            </div>

          );

        })}

      </div>

      {/* Quick Actions */}

      <div className="bg-white rounded-2xl shadow-sm p-6">

        <h2 className="text-xl font-semibold mb-5">

          Quick Actions

        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

          {quickActions.map((item) => (

            <button
              key={item}
              className="border rounded-xl py-6 hover:bg-blue-600 hover:text-white transition-all font-medium"
            >
              {item}
            </button>

          ))}

        </div>

      </div>
            {/* Revenue & Sales Analytics */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Revenue Trend */}

        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm p-6">

          <div className="flex justify-between items-center mb-6">

            <div>

              <h2 className="text-xl font-semibold">
                Revenue Analytics
              </h2>

              <p className="text-gray-500 text-sm">
                Monthly Revenue Overview
              </p>

            </div>

            <select className="border rounded-lg px-3 py-2">

              <option>2026</option>
              <option>2025</option>

            </select>

          </div>

          <div className="h-80 flex items-end justify-between gap-3">

            {[
              40,
              65,
              55,
              72,
              90,
              78,
              96,
              84,
              66,
              88,
              95,
              100,
            ].map((value, index) => (

              <div
                key={index}
                className="flex flex-col items-center flex-1"
              >

                <div
                  style={{
                    height: `${value}%`,
                  }}
                  className="w-full rounded-t-xl bg-linear-to-t from-blue-600 to-cyan-400 hover:from-cyan-500 hover:to-blue-700 transition-all"
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

        {/* Target Progress */}

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <h2 className="text-xl font-semibold mb-6">

            Monthly Target

          </h2>

          <div className="space-y-6">

            <div>

              <div className="flex justify-between mb-2">

                <span>Revenue</span>

                <span className="font-semibold">

                  84%

                </span>

              </div>

              <div className="w-full h-3 rounded-full bg-gray-200">

                <div className="h-3 rounded-full bg-green-500 w-[84%]" />

              </div>

            </div>

            <div>

              <div className="flex justify-between mb-2">

                <span>Orders</span>

                <span className="font-semibold">

                  73%

                </span>

              </div>

              <div className="w-full h-3 rounded-full bg-gray-200">

                <div className="h-3 rounded-full bg-blue-500 w-[73%]" />

              </div>

            </div>

            <div>

              <div className="flex justify-between mb-2">

                <span>Customer Growth</span>

                <span className="font-semibold">

                  91%

                </span>

              </div>

              <div className="w-full h-3 rounded-full bg-gray-200">

                <div className="h-3 rounded-full bg-purple-500 w-[91%]" />

              </div>

            </div>

            <div>

              <div className="flex justify-between mb-2">

                <span>Collection</span>

                <span className="font-semibold">

                  78%

                </span>

              </div>

              <div className="w-full h-3 rounded-full bg-gray-200">

                <div className="h-3 rounded-full bg-orange-500 w-[78%]" />

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Territory Performance */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <h2 className="text-xl font-semibold mb-6">

            Territory Performance

          </h2>

          {[
            {
              city: "Bhopal",
              value: 94,
            },
            {
              city: "Indore",
              value: 88,
            },
            {
              city: "Ujjain",
              value: 76,
            },
            {
              city: "Gwalior",
              value: 81,
            },
            {
              city: "Jabalpur",
              value: 69,
            },
          ].map((item) => (

            <div key={item.city} className="mb-6">

              <div className="flex justify-between mb-2">

                <span className="font-medium">

                  {item.city}

                </span>

                <span>

                  {item.value}%

                </span>

              </div>

              <div className="w-full h-3 rounded-full bg-gray-200">

                <div
                  className="h-3 rounded-full bg-blue-600"
                  style={{
                    width: `${item.value}%`,
                  }}
                />

              </div>

            </div>

          ))}

        </div>

        {/* Sales Performance */}

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <h2 className="text-xl font-semibold mb-6">

            Sales Performance

          </h2>

          <div className="grid grid-cols-2 gap-5">

            <div className="bg-blue-50 rounded-xl p-5">

              <h3 className="text-blue-700 text-sm">

                Daily Sales

              </h3>

              <p className="text-3xl font-bold mt-3">

                ₹1.82L

              </p>

            </div>

            <div className="bg-green-50 rounded-xl p-5">

              <h3 className="text-green-700 text-sm">

                Weekly Sales

              </h3>

              <p className="text-3xl font-bold mt-3">

                ₹11.4L

              </p>

            </div>

            <div className="bg-purple-50 rounded-xl p-5">

              <h3 className="text-purple-700 text-sm">

                Monthly Sales

              </h3>

              <p className="text-3xl font-bold mt-3">

                ₹42.8L

              </p>

            </div>

            <div className="bg-orange-50 rounded-xl p-5">

              <h3 className="text-orange-700 text-sm">

                Quarterly Sales

              </h3>

              <p className="text-3xl font-bold mt-3">

                ₹1.28Cr

              </p>

            </div>

          </div>

        </div>

      </div>
            {/* Team Performance & Top Performers */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Team Performance */}

        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm p-6">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-xl font-semibold">
              Team Performance
            </h2>

            <button className="text-blue-600 font-medium hover:underline">
              View All
            </button>

          </div>

          {[
            {
              name: "Rahul Sharma",
              designation: "Senior Sales Executive",
              target: "95%",
              orders: 148,
              revenue: "₹18.4L",
            },
            {
              name: "Neha Verma",
              designation: "Sales Executive",
              target: "91%",
              orders: 132,
              revenue: "₹16.8L",
            },
            {
              name: "Amit Patel",
              designation: "Sales Executive",
              target: "87%",
              orders: 118,
              revenue: "₹14.5L",
            },
            {
              name: "Rohit Singh",
              designation: "Sales Executive",
              target: "81%",
              orders: 104,
              revenue: "₹12.6L",
            },
          ].map((employee) => (

            <div
              key={employee.name}
              className="flex justify-between items-center border-b last:border-0 py-5"
            >

              <div className="flex items-center gap-4">

                <img
                  src={`https://ui-avatars.com/api/?name=${employee.name}`}
                  alt=""
                  className="w-14 h-14 rounded-full"
                />

                <div>

                  <h3 className="font-semibold text-lg">
                    {employee.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {employee.designation}
                  </p>

                </div>

              </div>

              <div className="hidden lg:block text-center">

                <p className="text-gray-500 text-sm">
                  Orders
                </p>

                <h3 className="font-bold">
                  {employee.orders}
                </h3>

              </div>

              <div className="hidden lg:block text-center">

                <p className="text-gray-500 text-sm">
                  Revenue
                </p>

                <h3 className="font-bold text-green-600">
                  {employee.revenue}
                </h3>

              </div>

              <div className="w-36">

                <div className="flex justify-between text-sm mb-2">

                  <span>Target</span>

                  <span>{employee.target}</span>

                </div>

                <div className="h-2 rounded-full bg-gray-200">

                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: employee.target,
                    }}
                  />

                </div>

              </div>

            </div>

          ))}

        </div>

        {/* Leaderboard */}

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <h2 className="text-xl font-semibold mb-6">
            Top Performers
          </h2>

          {[
            {
              name: "Rahul Sharma",
              sales: "₹18.4L",
            },
            {
              name: "Neha Verma",
              sales: "₹16.8L",
            },
            {
              name: "Amit Patel",
              sales: "₹14.5L",
            },
            {
              name: "Rohit Singh",
              sales: "₹12.6L",
            },
            {
              name: "Priya Jain",
              sales: "₹11.9L",
            },
          ].map((person, index) => (

            <div
              key={person.name}
              className="flex justify-between items-center py-4 border-b last:border-0"
            >

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">

                  {index + 1}

                </div>

                <div>

                  <h3 className="font-semibold">

                    {person.name}

                  </h3>

                  <p className="text-sm text-gray-500">

                    Sales Executive

                  </p>

                </div>

              </div>

              <span className="font-bold text-green-600">

                {person.sales}

              </span>

            </div>

          ))}

        </div>

      </div>

      {/* Recent Orders & AI Insights */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Recent Orders */}

        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm p-6 overflow-x-auto">

          <div className="flex justify-between items-center mb-5">

            <h2 className="text-xl font-semibold">
              Recent Orders
            </h2>

            <button className="text-blue-600 hover:underline">

              View All

            </button>

          </div>

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-4 text-left">Order ID</th>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Date</th>

              </tr>

            </thead>

            <tbody>

              {[
                ["ORD1021","ABC Traders","₹45,000","Completed","Today"],
                ["ORD1022","Royal Mart","₹18,500","Pending","Today"],
                ["ORD1023","Om Enterprises","₹28,400","Completed","Yesterday"],
                ["ORD1024","Shree Agencies","₹12,600","Processing","Yesterday"],
                ["ORD1025","City Distributor","₹54,800","Completed","Yesterday"],
              ].map((item,index)=>(

                <tr
                  key={index}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-4 font-semibold">{item[0]}</td>
                  <td className="p-4">{item[1]}</td>
                  <td className="p-4 font-semibold">{item[2]}</td>

                  <td className="p-4">

                    <span className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${
                      item[3]=="Completed"
                      ?"bg-green-100 text-green-700"
                      :item[3]=="Pending"
                      ?"bg-yellow-100 text-yellow-700"
                      :"bg-blue-100 text-blue-700"
                    }`}>

                      {item[3]}

                    </span>

                  </td>

                  <td className="p-4">{item[4]}</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* AI Insights */}

        <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-sm p-6 text-white">

          <h2 className="text-xl font-semibold mb-6">

            AI Insights

          </h2>

          <div className="space-y-5">

            <div className="bg-white/10 rounded-xl p-4">

              <h3 className="font-semibold mb-2">

                Revenue Prediction

              </h3>

              <p className="text-sm">

                Revenue is expected to increase by
                <span className="font-bold"> 14% </span>
                this month.

              </p>

            </div>

            <div className="bg-white/10 rounded-xl p-4">

              <h3 className="font-semibold mb-2">

                Best Territory

              </h3>

              <p className="text-sm">

                Indore region generated the highest sales this week.

              </p>

            </div>

            <div className="bg-white/10 rounded-xl p-4">

              <h3 className="font-semibold mb-2">

                Recommendation

              </h3>

              <p className="text-sm">

                Increase visits in Ujjain to improve order conversion.

              </p>

            </div>

          </div>

        </div>

      </div>
            {/* Today's Schedule + Top Products */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Today's Schedule */}

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-xl font-semibold">
              Today's Schedule
            </h2>

            <button className="text-blue-600 hover:underline">
              View Calendar
            </button>

          </div>

          {[
            {
              time: "09:00 AM",
              customer: "ABC Traders",
              location: "Bhopal",
            },
            {
              time: "11:30 AM",
              customer: "Royal Mart",
              location: "Indore",
            },
            {
              time: "02:00 PM",
              customer: "Shree Agencies",
              location: "Ujjain",
            },
            {
              time: "04:30 PM",
              customer: "Om Enterprises",
              location: "Gwalior",
            },
          ].map((item, index) => (

            <div
              key={index}
              className="flex justify-between items-center border-b last:border-0 py-4"
            >

              <div className="flex gap-4">

                <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center font-bold text-blue-700">

                  {item.time.split(" ")[0]}

                </div>

                <div>

                  <h3 className="font-semibold">

                    {item.customer}

                  </h3>

                  <p className="text-gray-500 text-sm">

                    {item.location}

                  </p>

                </div>

              </div>

              <span className="text-sm font-medium text-blue-600">

                {item.time}

              </span>

            </div>

          ))}

        </div>

        {/* Top Selling Products */}

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-xl font-semibold">

              Top Selling Products

            </h2>

            <button className="text-blue-600 hover:underline">

              View All

            </button>

          </div>

          {[
            {
              product: "Premium Cement",
              sales: "₹48.5L",
              qty: 4820,
            },
            {
              product: "Ultra Steel",
              sales: "₹42.8L",
              qty: 3985,
            },
            {
              product: "Construction Sand",
              sales: "₹31.2L",
              qty: 2850,
            },
            {
              product: "Concrete Blocks",
              sales: "₹26.4L",
              qty: 2145,
            },
          ].map((item) => (

            <div
              key={item.product}
              className="border-b last:border-0 py-4"
            >

              <div className="flex justify-between">

                <div>

                  <h3 className="font-semibold">

                    {item.product}

                  </h3>

                  <p className="text-sm text-gray-500">

                    {item.qty} Units Sold

                  </p>

                </div>

                <span className="font-bold text-green-600">

                  {item.sales}

                </span>

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* Recent Activities */}

      <div className="bg-white rounded-2xl shadow-sm p-6">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-xl font-semibold">

            Recent Activities

          </h2>

          <button className="text-blue-600 hover:underline">

            View All

          </button>

        </div>

        {[
          {
            activity: "New order placed by ABC Traders",
            user: "Rahul Sharma",
            time: "5 mins ago",
          },
          {
            activity: "Payment received from Royal Mart",
            user: "Finance Team",
            time: "25 mins ago",
          },
          {
            activity: "Customer visit completed",
            user: "Neha Verma",
            time: "1 hour ago",
          },
          {
            activity: "Target updated for July",
            user: "Sales Head",
            time: "2 hours ago",
          },
          {
            activity: "New customer added",
            user: "Rahul Sharma",
            time: "Yesterday",
          },
        ].map((item, index) => (

          <div
            key={index}
            className="flex justify-between items-center border-b last:border-0 py-5"
          >

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">

                {item.user.charAt(0)}

              </div>

              <div>

                <h3 className="font-semibold">

                  {item.activity}

                </h3>

                <p className="text-sm text-gray-500">

                  {item.user}

                </p>

              </div>

            </div>

            <span className="text-sm text-gray-500">

              {item.time}

            </span>

          </div>

        ))}

      </div>

      {/* Sales Pipeline */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="bg-blue-50 rounded-2xl p-6">

          <p className="text-blue-600 font-medium">
            New Leads
          </p>

          <h2 className="text-4xl font-bold mt-3">
            248
          </h2>

        </div>

        <div className="bg-yellow-50 rounded-2xl p-6">

          <p className="text-yellow-600 font-medium">
            Negotiation
          </p>

          <h2 className="text-4xl font-bold mt-3">
            96
          </h2>

        </div>

        <div className="bg-purple-50 rounded-2xl p-6">

          <p className="text-purple-600 font-medium">
            In Progress
          </p>

          <h2 className="text-4xl font-bold mt-3">
            74
          </h2>

        </div>

        <div className="bg-green-50 rounded-2xl p-6">

          <p className="text-green-600 font-medium">
            Closed Deals
          </p>

          <h2 className="text-4xl font-bold mt-3">
            382
          </h2>

        </div>

      </div>

    </div>
  );
}