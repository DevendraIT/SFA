import { useState } from "react";
import { Outlet } from "react-router";
import Sidebar, { MobileBottomNav } from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";

export default function DashboardLayout({
  navItems,
  roleLabel,
  settingsPath,
  showMobileBottomNav = false,
  mobileBottomNavMaxItems = 5,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar
        navItems={navItems}
        roleLabel={roleLabel}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar
          settingsPath={settingsPath}
          onMenuClick={() => setMobileOpen(true)}
        />

        <main
          className={`flex-1 overflow-y-auto p-4 md:p-6 ${
            showMobileBottomNav ? "pb-20 md:pb-6" : ""
          }`}
        >
          <Outlet />
        </main>
      </div>

      {showMobileBottomNav && (
        <MobileBottomNav navItems={navItems} maxItems={mobileBottomNavMaxItems} />
      )}
    </div>
  );
}
