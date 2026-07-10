import { NavLink } from "react-router";
import { ChevronLeft, ChevronRight, Hexagon } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Sidebar({ navItems, roleLabel, collapsed, setCollapsed, mobileOpen, onMobileClose }) {
  const { user } = useAuth();

  const sidebarContent = (
    <>
      <div className="flex items-center gap-3 border-b border-slate-200/60 px-4 py-5 dark:border-slate-700/60">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-600 shadow-lg shadow-primary-600/30">
          <Hexagon className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">SFA</h1>
            <p className="text-[11px] font-medium uppercase tracking-widest text-primary-600 dark:text-primary-400">
              {roleLabel}
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            onClick={onMobileClose}
            className={({ isActive }) =>
              `sfa-nav-link ${isActive ? "sfa-nav-link-active" : "sfa-nav-link-inactive"}`
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {!collapsed && user && (
        <div className="mx-3 mb-3 rounded-xl border border-slate-200/60 bg-slate-50 p-3 dark:border-slate-700/60 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">{user.name}</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setCollapsed(!collapsed)}
        data-skip-global-action="true"
        className="hidden border-t border-slate-200/60 p-3 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:border-slate-700/60 dark:hover:bg-slate-800 dark:hover:text-slate-200 md:flex md:justify-center"
      >
        {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
      </button>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden h-screen shrink-0 flex-col border-r border-slate-200/80 bg-white transition-all duration-300 ease-out dark:border-slate-800 dark:bg-slate-900 md:flex ${
          collapsed ? "w-[72px]" : "w-64"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={onMobileClose}
          />
          <aside className="absolute left-0 top-0 bottom-0 flex w-72 flex-col border-r border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}

export function MobileBottomNav({ navItems, maxItems = 5 }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-around border-t border-slate-200 bg-white/95 px-1 py-2 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/95 md:hidden">
      {navItems.slice(0, maxItems).map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 rounded-xl px-2 py-1 text-[10px] font-semibold transition-all duration-200 ${
              isActive
                ? "text-primary-600 dark:text-primary-400"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            }`
          }
        >
          <Icon className="h-5 w-5" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
