import {
  Target,
  Plus,
  Search,
  Download,
  Filter,
  TrendingUp,
  Calendar,
  Users,
} from "lucide-react";

export default function HOSTargets() {

  const cards = [
    {
      title: "Active Targets",
      value: "86",
      icon: Target,
      color: "bg-blue-500",
    },
    {
      title: "Completed",
      value: "52",
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      title: "Pending",
      value: "21",
      icon: Calendar,
      color: "bg-orange-500",
    },
    {
      title: "Managers",
      value: "18",
      icon: Users,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold dark:text-white">
            Target Management
          </h1>

          <p className="text-gray-500 dark:text-gray-400">
            Assign and monitor sales targets
          </p>

        </div>

        <div className="flex gap-3">

          <button className="bg-green-600 text-white px-5 py-3 rounded-xl flex items-center gap-2">

            <Plus size={18}/>

            Create Target

          </button>

          <button className="bg-blue-600 text-white px-5 py-3 rounded-xl flex items-center gap-2">

            <Download size={18}/>

            Export

          </button>

        </div>

      </div>

      {/* Cards */}

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

        {cards.map((card)=>{

          const Icon=card.icon;

          return(

            <div
              key={card.title}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6"
            >

              <div className="flex justify-between">

                <div>

                  <p className="text-gray-500">
                    {card.title}
                  </p>

                  <h2 className="text-3xl font-bold mt-2 dark:text-white">
                    {card.value}
                  </h2>

                </div>

                <div className={`${card.color} h-14 w-14 rounded-xl flex items-center justify-center`}>

                  <Icon color="white"/>

                </div>

              </div>

            </div>

          )

        })}

      </div>

      {/* Search */}

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-5">

        <div className="flex flex-col lg:flex-row gap-4">

          <div className="flex items-center bg-gray-100 dark:bg-slate-700 rounded-xl px-4 flex-1">

            <Search size={18}/>

            <input
              type="text"
              placeholder="Search Target..."
              className="bg-transparent ml-3 outline-none w-full py-3 dark:text-white"
            />

          </div>

          <select className="border rounded-xl px-4 py-3 dark:bg-slate-700 dark:text-white">

            <option>Monthly</option>

            <option>Quarterly</option>

            <option>Yearly</option>

          </select>

          <button className="bg-gray-800 text-white px-5 rounded-xl flex items-center gap-2">

            <Filter size={18}/>

            Filter

          </button>

        </div>

      </div>
            {/* Target Table */}

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow overflow-hidden">

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="bg-gray-100 dark:bg-slate-700">

              <tr>

                <th className="px-6 py-4 text-left">Target Name</th>

                <th className="px-6 py-4 text-left">Assigned To</th>

                <th className="px-6 py-4 text-left">Territory</th>

                <th className="px-6 py-4 text-left">Target</th>

                <th className="px-6 py-4 text-left">Achievement</th>

                <th className="px-6 py-4 text-left">Due Date</th>

                <th className="px-6 py-4 text-left">Status</th>

                <th className="px-6 py-4 text-center">Action</th>

              </tr>

            </thead>

            <tbody>

              {[
                {
                  target: "July Sales",
                  manager: "Rahul Sharma",
                  territory: "North Zone",
                  amount: "₹45 L",
                  progress: 92,
                  due: "31 Jul 2026",
                  status: "Completed",
                },
                {
                  target: "Medical Products",
                  manager: "Priya Verma",
                  territory: "West Zone",
                  amount: "₹38 L",
                  progress: 84,
                  due: "31 Jul 2026",
                  status: "Running",
                },
                {
                  target: "Retail Campaign",
                  manager: "Amit Patel",
                  territory: "South Zone",
                  amount: "₹40 L",
                  progress: 65,
                  due: "31 Jul 2026",
                  status: "Pending",
                },
                {
                  target: "Distributor Sales",
                  manager: "Neha Singh",
                  territory: "East Zone",
                  amount: "₹35 L",
                  progress: 76,
                  due: "31 Jul 2026",
                  status: "Running",
                },
              ].map((item, index) => (

                <tr
                  key={index}
                  className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700"
                >

                  <td className="px-6 py-5 font-semibold dark:text-white">
                    {item.target}
                  </td>

                  <td className="px-6">
                    {item.manager}
                  </td>

                  <td className="px-6">
                    {item.territory}
                  </td>

                  <td className="px-6 font-semibold">
                    {item.amount}
                  </td>

                  <td className="px-6">

                    <div className="w-36 bg-gray-200 rounded-full h-2">

                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${item.progress}%`,
                        }}
                      ></div>

                    </div>

                    <span className="text-sm mt-1 inline-block">
                      {item.progress}%
                    </span>

                  </td>

                  <td className="px-6">
                    {item.due}
                  </td>

                  <td className="px-6">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        item.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : item.status === "Running"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {item.status}
                    </span>

                  </td>

                  <td className="px-6">

                    <div className="flex justify-center gap-2">

                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg">
                        Edit
                      </button>

                      <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg">
                        View
                      </button>

                      <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg">
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

      {/* Analytics */}

      <div className="grid lg:grid-cols-2 gap-6">

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">

          <h2 className="text-xl font-bold mb-5 dark:text-white">
            Target Achievement
          </h2>

          <div className="h-72 rounded-xl bg-linear-to-r from-blue-100 to-cyan-100 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">

            Achievement Chart

          </div>

        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">

          <h2 className="text-xl font-bold mb-5 dark:text-white">
            Monthly Progress
          </h2>

          <div className="space-y-5">

            {[
              ["January", 72],
              ["February", 84],
              ["March", 91],
              ["April", 77],
              ["May", 95],
              ["June", 88],
            ].map((month) => (

              <div key={month[0]}>

                <div className="flex justify-between mb-2">

                  <span>{month[0]}</span>

                  <span>{month[1]}%</span>

                </div>

                <div className="bg-gray-200 rounded-full h-3">

                  <div
                    className="bg-blue-600 h-3 rounded-full"
                    style={{
                      width: `${month[1]}%`,
                    }}
                  ></div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

      {/* Pagination */}

      <div className="flex justify-between items-center">

        <p className="text-gray-500">
          Showing 1-4 of 86 Targets
        </p>

        <div className="flex gap-2">

          <button className="px-4 py-2 border rounded-lg">
            Previous
          </button>

          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            1
          </button>

          <button className="px-4 py-2 border rounded-lg">
            2
          </button>

          <button className="px-4 py-2 border rounded-lg">
            3
          </button>

          <button className="px-4 py-2 border rounded-lg">
            Next
          </button>

        </div>

      </div>

    </div>

  );
}