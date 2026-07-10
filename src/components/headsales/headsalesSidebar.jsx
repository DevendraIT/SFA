import { useState } from "react";
import { NavLink } from "react-router";
import {
  LayoutDashboard, TrendingUp, Users, IndianRupee, Target,
  FileBarChart, Sparkles, GitCompare, ChevronLeft, ChevronRight, Crown,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const navItems = [
  { to: "/headsales/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/headsales/sales-analytics", label: "Sales Analytics", icon: TrendingUp },
  { to: "/headsales/team-performance", label: "Team Performance", icon: Users },
  { to: "/headsales/revenue", label: "Revenue", icon: IndianRupee },
  { to: "/headsales/targets", label: "Targets", icon: Target },
  { to: "/headsales/reports", label: "Reports", icon: FileBarChart },
  { to: "/headsales/ai-suggestions", label: "AI Suggestions", icon: Sparkles },
  { to: "/headsales/team-comparison", label: "Team Comparison", icon: GitCompare },
];

export default function HeadSalesSidebar({ collapsed, setCollapsed }) {
  const { user } = useAuth();

  return (
    <aside className={`${collapsed ? "w-[68px]" : "w-60"} h-screen bg-white dark:bg-slate-900 border-r border-emerald-100 dark:border-emerald-900/30 flex flex-col transition-all shrink-0`}>
      <div className="p-5 bg-gradient-to-r from-blue-600 to-emerald-500">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Crown className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-extrabold text-white text-sm">SFA</h1>
              <p className="text-[10px] text-emerald-100 uppercase tracking-wider">Head of Sales</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-semibold transition-all border-l-4 ${
                isActive
                  ? "bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 text-blue-700 dark:text-emerald-300 border-emerald-500"
                  : "text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800"
              }`
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            {!collapsed && label}
          </NavLink>
        ))}
      </nav>

      {!collapsed && user && (
        <div className="m-3 p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 text-white">
          <p className="text-xs opacity-80">Logged in as</p>
          <p className="font-bold text-sm truncate">{user.name}</p>
        </div>
      )}

      <button onClick={() => setCollapsed(!collapsed)} className="p-3 border-t flex justify-center text-slate-400 hover:text-blue-600">
        {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>
    </aside>
  );
}
