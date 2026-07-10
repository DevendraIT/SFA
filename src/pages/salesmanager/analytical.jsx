import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Target,
  Calendar,
  Download,
  Filter,
} from "lucide-react";

export default function SMAnalytics() {

  const kpis = [
    {
      title: "Revenue",
      value: "₹2.48 Cr",
      growth: "+18%",
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      title: "Orders",
      value: "1,284",
      growth: "+12%",
      icon: ShoppingCart,
      color: "bg-blue-500",
    },
    {
      title: "Customers",
      value: "682",
      growth: "+8%",
      icon: Users,
      color: "bg-purple-500",
    },
    {
      title: "Target",
      value: "84%",
      growth: "+5%",
      icon: Target,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col lg:flex-row justify-between lg:items-center">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            Sales Analytics
          </h1>

          <p className="text-gray-500 mt-1">
            Monitor business performance and sales insights.
          </p>

        </div>

        <div className="flex gap-3 mt-5 lg:mt-0">

          <button className="flex items-center gap-2 border px-5 py-3 rounded-xl hover:bg-gray-100">

            <Filter size={18}/>

            Filter

          </button>

          <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700">

            <Download size={18}/>

            Export Report

          </button>

        </div>

      </div>

      {/* KPI Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {kpis.map((item)=>{

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

              <div className="mt-5 flex items-center gap-2">

                <TrendingUp
                  className="text-green-600"
                  size={18}
                />

                <span className="text-green-600 font-semibold">

                  {item.growth}

                </span>

                <span className="text-gray-400">

                  vs last month

                </span>

              </div>

            </div>

          )

        })}

      </div>

      {/* Revenue Analytics */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Chart */}

        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm p-6">

          <div className="flex justify-between items-center mb-6">

            <div>

              <h2 className="text-xl font-semibold">

                Revenue Trend

              </h2>

              <p className="text-gray-500 text-sm">

                Monthly Revenue Analytics

              </p>

            </div>

            <select className="border rounded-lg px-3 py-2">

              <option>2026</option>
              <option>2025</option>

            </select>

          </div>

          <div className="h-80 flex items-end gap-3">

            {[48,56,63,70,75,81,86,79,88,92,95,100].map((item,index)=>(

              <div
                key={index}
                className="flex-1 flex flex-col items-center"
              >

                <div
                  style={{
                    height:`${item}%`
                  }}
                  className="w-full rounded-t-xl bg-linear-to-t from-blue-600 to-cyan-400"
                />

                <span className="text-xs text-gray-500 mt-2">

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

        {/* Target Achievement */}

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <h2 className="text-xl font-semibold mb-6">

            Target Achievement

          </h2>

          {[
            {
              title:"Revenue",
              value:84,
              color:"bg-green-500"
            },
            {
              title:"Orders",
              value:79,
              color:"bg-blue-500"
            },
            {
              title:"Collection",
              value:92,
              color:"bg-purple-500"
            },
            {
              title:"Customer Growth",
              value:73,
              color:"bg-orange-500"
            }
          ].map((item)=>(

            <div
              key={item.title}
              className="mb-6"
            >

              <div className="flex justify-between mb-2">

                <span>

                  {item.title}

                </span>

                <span className="font-semibold">

                  {item.value}%

                </span>

              </div>

              <div className="w-full bg-gray-200 h-3 rounded-full">

                <div
                  className={`${item.color} h-3 rounded-full`}
                  style={{
                    width:`${item.value}%`
                  }}
                />

              </div>

            </div>

          ))}

        </div>

      </div>
            {/* Territory Performance & Sales Executive */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Territory Performance */}

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
            { city: "Bhopal", revenue: "₹58L", progress: 95 },
            { city: "Indore", revenue: "₹49L", progress: 88 },
            { city: "Jabalpur", revenue: "₹43L", progress: 80 },
            { city: "Gwalior", revenue: "₹39L", progress: 74 },
            { city: "Ujjain", revenue: "₹34L", progress: 67 },
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
                    {item.revenue}
                  </p>

                </div>

                <span className="font-semibold">
                  {item.progress}%
                </span>

              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">

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

        {/* Sales Executive */}

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-xl font-semibold">
              Sales Executive Performance
            </h2>

            <button className="text-blue-600 hover:underline">
              View All
            </button>

          </div>

          {[
            {
              name: "Rahul Sharma",
              sales: "₹18.2L",
              orders: 142,
              progress: 96,
            },
            {
              name: "Neha Verma",
              sales: "₹16.7L",
              orders: 136,
              progress: 91,
            },
            {
              name: "Amit Patel",
              sales: "₹15.1L",
              orders: 124,
              progress: 84,
            },
            {
              name: "Rohit Singh",
              sales: "₹13.9L",
              orders: 118,
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

                      {emp.orders} Orders

                    </p>

                  </div>

                </div>

                <span className="font-bold text-green-600">

                  {emp.sales}

                </span>

              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">

                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${emp.progress}%`,
                  }}
                />

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* Customer Analytics & Product Analytics */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Customer Analytics */}

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <h2 className="text-xl font-semibold mb-6">
            Customer Analytics
          </h2>

          <div className="grid grid-cols-2 gap-5">

            <div className="bg-blue-50 rounded-xl p-5">

              <p className="text-gray-500">
                Total Customers
              </p>

              <h2 className="text-3xl font-bold mt-2">
                682
              </h2>

            </div>

            <div className="bg-green-50 rounded-xl p-5">

              <p className="text-gray-500">
                Active Customers
              </p>

              <h2 className="text-3xl font-bold mt-2">
                615
              </h2>

            </div>

            <div className="bg-yellow-50 rounded-xl p-5">

              <p className="text-gray-500">
                New Customers
              </p>

              <h2 className="text-3xl font-bold mt-2">
                46
              </h2>

            </div>

            <div className="bg-purple-50 rounded-xl p-5">

              <p className="text-gray-500">
                Lost Customers
              </p>

              <h2 className="text-3xl font-bold mt-2">
                8
              </h2>

            </div>

          </div>

        </div>

        {/* Product Performance */}

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <h2 className="text-xl font-semibold mb-6">
            Product Performance
          </h2>

          {[
            {
              product: "Premium Cement",
              sales: "₹48.5L",
              progress: 95,
            },
            {
              product: "Ultra Steel",
              sales: "₹43.2L",
              progress: 88,
            },
            {
              product: "Concrete Blocks",
              sales: "₹36.4L",
              progress: 80,
            },
            {
              product: "Construction Sand",
              sales: "₹31.7L",
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
                    {item.sales}
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

      </div>
            {/* Revenue Distribution & AI Insights */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Revenue Distribution */}

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <h2 className="text-xl font-semibold mb-6">
            Revenue Distribution
          </h2>

          {[
            {
              label: "Retail",
              revenue: "₹82L",
              progress: 82,
              color: "bg-blue-600",
            },
            {
              label: "Wholesale",
              revenue: "₹61L",
              progress: 61,
              color: "bg-green-500",
            },
            {
              label: "Distributor",
              revenue: "₹48L",
              progress: 48,
              color: "bg-purple-500",
            },
            {
              label: "Online",
              revenue: "₹29L",
              progress: 29,
              color: "bg-orange-500",
            },
          ].map((item) => (

            <div
              key={item.label}
              className="mb-6"
            >

              <div className="flex justify-between mb-2">

                <span className="font-medium">
                  {item.label}
                </span>

                <span className="font-semibold">
                  {item.revenue}
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

        {/* Monthly Comparison */}

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <h2 className="text-xl font-semibold mb-6">
            Monthly Comparison
          </h2>

          <div className="h-72 flex items-end gap-3">

            {[45,52,60,66,72,78,81,86,92,89,96,100].map((item,index)=>(

              <div
                key={index}
                className="flex flex-col items-center flex-1"
              >

                <div
                  className="bg-linear-to-t from-green-600 to-green-300 rounded-t-xl w-full"
                  style={{
                    height:`${item}%`
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

        {/* AI Insights */}

        <div className="bg-linear-to-br from-blue-600 to-indigo-700 text-white rounded-2xl shadow-sm p-6">

          <h2 className="text-xl font-semibold mb-6">
            AI Insights
          </h2>

          <div className="space-y-5">

            <div className="bg-white/10 rounded-xl p-4">

              <h3 className="font-semibold mb-2">
                Revenue Forecast
              </h3>

              <p className="text-sm">
                AI predicts a
                <span className="font-bold">
                  {" "}16%{" "}
                </span>
                increase in revenue next month.
              </p>

            </div>

            <div className="bg-white/10 rounded-xl p-4">

              <h3 className="font-semibold mb-2">
                Best Performing Territory
              </h3>

              <p className="text-sm">
                Bhopal has achieved
                <span className="font-bold">
                  {" "}95%
                </span>
                of the monthly target.
              </p>

            </div>

            <div className="bg-white/10 rounded-xl p-4">

              <h3 className="font-semibold mb-2">
                Recommendation
              </h3>

              <p className="text-sm">
                Increase executive visits in Ujjain and Gwalior to improve
                conversion rates.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Recent Analytics Activity */}

      <div className="bg-white rounded-2xl shadow-sm p-6">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-xl font-semibold">
            Recent Analytics Activity
          </h2>

          <button className="text-blue-600 hover:underline">
            View All
          </button>

        </div>

        {[
          {
            activity: "Revenue report generated",
            user: "Rahul Sharma",
            time: "15 mins ago",
          },
          {
            activity: "Monthly analytics exported",
            user: "Sales Manager",
            time: "1 hour ago",
          },
          {
            activity: "Territory performance updated",
            user: "System",
            time: "Today",
          },
          {
            activity: "AI generated new recommendations",
            user: "AI Engine",
            time: "Today",
          },
          {
            activity: "Sales target achievement refreshed",
            user: "System",
            time: "Yesterday",
          },
        ].map((item,index)=>(

          <div
            key={index}
            className="flex justify-between items-center border-b last:border-0 py-5"
          >

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">

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

      {/* Analytics Summary */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="bg-blue-50 rounded-2xl p-6">

          <p className="text-blue-600 font-medium">
            Total Revenue
          </p>

          <h2 className="text-3xl font-bold mt-3">
            ₹2.48 Cr
          </h2>

        </div>

        <div className="bg-green-50 rounded-2xl p-6">

          <p className="text-green-600 font-medium">
            Total Orders
          </p>

          <h2 className="text-3xl font-bold mt-3">
            1,284
          </h2>

        </div>

        <div className="bg-purple-50 rounded-2xl p-6">

          <p className="text-purple-600 font-medium">
            Active Customers
          </p>

          <h2 className="text-3xl font-bold mt-3">
            615
          </h2>

        </div>

        <div className="bg-orange-50 rounded-2xl p-6">

          <p className="text-orange-600 font-medium">
            Target Achievement
          </p>

          <h2 className="text-3xl font-bold mt-3">
            84%
          </h2>

        </div>

      </div>

    </div>
  );
}