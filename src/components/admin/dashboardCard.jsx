import {
  Building2,
  Building,
  GitBranch,
  MapPinned,
  Users,
  UserCheck,
  Wallet,
  TrendingUp,
} from "lucide-react";

export default function DashboardCards({ data, loading }) {
  const cards = [
    {
      title: "Organizations",
      value: data.organizations,
      icon: Building2,
      color: "from-blue-500 to-blue-700",
      bg: "bg-blue-50",
      text: "text-blue-700",
      growth: "+12%",
    },
    {
      title: "Companies",
      value: data.companies,
      icon: Building,
      color: "from-indigo-500 to-indigo-700",
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      growth: "+8%",
    },
    {
      title: "Branches",
      value: data.branches,
      icon: GitBranch,
      color: "from-green-500 to-green-700",
      bg: "bg-green-50",
      text: "text-green-700",
      growth: "+15%",
    },
    {
      title: "Territories",
      value: data.territories,
      icon: MapPinned,
      color: "from-purple-500 to-purple-700",
      bg: "bg-purple-50",
      text: "text-purple-700",
      growth: "+9%",
    },
    {
      title: "Departments",
      value: data.departments,
      icon: Building,
      color: "from-orange-500 to-orange-700",
      bg: "bg-orange-50",
      text: "text-orange-700",
      growth: "+5%",
    },
    {
      title: "Users",
      value: data.users,
      icon: Users,
      color: "from-cyan-500 to-cyan-700",
      bg: "bg-cyan-50",
      text: "text-cyan-700",
      growth: "+21%",
    },
    {
      title: "Active Users",
      value: data.activeUsers,
      icon: UserCheck,
      color: "from-emerald-500 to-emerald-700",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      growth: "+6%",
    },
    {
      title: "Revenue",
      value: `₹${Number(data.revenue || 0).toLocaleString()}`,
      icon: Wallet,
      color: "from-pink-500 to-rose-600",
      bg: "bg-pink-50",
      text: "text-pink-700",
      growth: "+18%",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={index}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div
              className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${card.color}`}
            />

            <div className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {card.title}
                  </p>

                  {loading ? (
                    <div className="h-9 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mt-3" />
                  ) : (
                    <h2 className="text-3xl font-bold mt-2 text-slate-800 dark:text-white">
                      {card.value}
                    </h2>
                  )}
                </div>

                <div
                  className={`w-16 h-16 rounded-2xl ${card.bg} flex items-center justify-center`}
                >
                  <Icon className={card.text} size={30} />
                </div>
              </div>

              <div className="flex justify-between items-center mt-6">
                <span className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                  <TrendingUp size={16} />
                  {card.growth}
                </span>

                <span className="text-xs text-slate-400">
                  This Month
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}