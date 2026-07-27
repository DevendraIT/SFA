import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-slate-100">

      {/* Sidebar */}

      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main Area */}

      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Navbar */}

        <Navbar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        {/* Page */}

        <main className="flex-1 overflow-y-auto p-6">

          <Outlet />

        </main>

      </div>

    </div>
  );
}