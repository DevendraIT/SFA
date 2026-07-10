import { NavLink } from "react-router";
import {
  LayoutDashboard,
  Users,
  MapPinned,
  UserPlus,
  ShoppingBag,
  BarChart3,
  Settings,
  Navigation,
} from "lucide-react";

const navItems = [
  { to: "/salesperson/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/salesperson/customers", label: "Customers", icon: Users },
  { to: "/salesperson/visits", label: "Visits", icon: MapPinned },
  { to: "/salesperson/leads", label: "Leads", icon: UserPlus },
  { to: "/salesperson/orders", label: "Orders", icon: ShoppingBag },
  { to: "/salesperson/performances", label: "Performance", icon: BarChart3 },
  { to: "/salesperson/products", label: "Products", icon: ShoppingBag },
  { to: "/salesperson/settings", label: "Settings", icon: Settings },
];

export default function SalesPersonSidebar() {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-52 h-screen bg-linear-to-b from-orange-500 to-green-600 text-white flex-col shrink-0">
        <div className="p-5">
          <div className="flex items-center gap-2">
            <Navigation className="w-7 h-7" />
            <div>
              <h1 className="font-black text-lg">SFA</h1>
              <p className="text-[10px] text-orange-100 uppercase">Sales Person</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                  isActive ? "bg-white text-orange-600 shadow-lg" : "text-white/90 hover:bg-white/15"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-orange-200 dark:border-orange-900/30 flex justify-around py-2 px-1 safe-area-pb shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        {navItems.slice(0, 5).map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl text-[10px] font-bold transition-all ${
                isActive ? "text-orange-600" : "text-slate-400"
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}

export { navItems };
