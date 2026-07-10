import { useState } from "react";
import { NavLink } from "react-router";
import {
  LayoutDashboard,
  Users,
  Clock,
  ShoppingCart,
  UserPlus,
  FileText,
  ChevronLeft,
  ChevronRight,
  Zap,
  MapPinned,
  Target,
  BarChart3,
} from "lucide-react";

const navItems = [
  { to: "/salesmanager/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/salesmanager/customers", label: "Customers", icon: Users },
  { to: "/salesmanager/visits", label: "Visits", icon: MapPinned },
  { to: "/salesmanager/leads", label: "Leads", icon: UserPlus },
  { to: "/salesmanager/orders", label: "Orders", icon: ShoppingCart },
  { to: "/salesmanager/targets", label: "Targets", icon: Target },
  { to: "/salesmanager/team", label: "Team", icon: Users },
  { to: "/salesmanager/attendance", label: "Attendance", icon: Clock },
  { to: "/salesmanager/territory", label: "Territory", icon: MapPinned },
  { to: "/salesmanager/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/salesmanager/reports", label: "Reports", icon: FileText },
];

export default function SalesManagerSidebar({ collapsed, setCollapsed }) {
  return (
    <aside className={`${collapsed ? "w-16" : "w-56"} h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-cyan-900 text-white flex flex-col shrink-0 transition-all`}>
      <div className="p-4 text-center border-b border-purple-700/50">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-400/20 backdrop-blur border border-cyan-400/30">
          <Zap className="w-6 h-6 text-cyan-300" />
        </div>
        {!collapsed && (
          <div className="mt-2">
            <h2 className="font-black text-lg tracking-tight">SFA</h2>
            <p className="text-[10px] text-cyan-300 uppercase tracking-[0.2em]">Sales Manager</p>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-cyan-500/20 text-cyan-200 shadow-inner ring-1 ring-cyan-400/30"
                  : "text-purple-200 hover:bg-purple-700/50 hover:text-white"
              }`
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            {!collapsed && label}
          </NavLink>
        ))}
      </nav>

      <button onClick={() => setCollapsed(!collapsed)} className="p-3 border-t border-purple-700/50 flex justify-center hover:bg-purple-700/30">
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}
