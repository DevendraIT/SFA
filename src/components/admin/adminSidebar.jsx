import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard, Building2, Users, Shield, BarChart3, FileText,
  ScrollText, Settings, Brain, ChevronLeft, ChevronRight, Hexagon,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const navItems = [
  { to: "/admin/Dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/Organization", label: "Organization", icon: Building2 },
  { to: "/admin/Users", label: "Users", icon: Users },
  { to: "/admin/Targets", label: "Targets", icon: Shield },
  { to: "/admin/Analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/Reports", label: "Reports", icon: FileText },
  { to: "/admin/FieldForce", label: "Field Force", icon: ScrollText },
  { to: "/admin/AILeads", label: "AI Leads", icon: Brain },
  { to: "/admin/Orders", label: "Orders", icon: FileText },
  { to: "/admin/Settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar({ collapsed, setCollapsed }) {
  const { user } = useAuth();

  return (
    <aside
      className={`${collapsed ? "w-[72px]" : "w-64"} h-screen bg-gradient-to-b from-indigo-950 via-indigo-900 to-slate-900 text-white flex flex-col transition-all duration-300 shrink-0`}
    >
      <div className="p-4 flex items-center gap-3 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/30 backdrop-blur flex items-center justify-center">
          <Hexagon className="w-5 h-5 text-indigo-300" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="font-bold text-sm tracking-wide">SFA </h1>
            <p className="text-[10px] text-indigo-300 uppercase tracking-widest">Admin</p>
          </div>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-white/15 text-white shadow-lg backdrop-blur"
                  : "text-indigo-200 hover:bg-white/8 hover:text-white"
              }`
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {!collapsed && user && (
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold">
              {user.name?.[0]}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-xs text-indigo-300 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-3 border-t border-white/10 flex justify-center hover:bg-white/5 transition-colors"
      >
        {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>
    </aside>
  );
}
