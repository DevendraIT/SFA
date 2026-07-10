import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Bell, Sun, Moon, LogOut, User, Settings, Search, Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import storage from "../../services/storage.js";

export default function HeadSalesNavbar({ setCollapsed }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    const refresh = () => setNotifs(storage.notifications.getAll().slice(0, 5));
    refresh();
    return storage.subscribe(refresh);
  }, []);

  return (
    <header className="h-14 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-emerald-100 dark:border-emerald-900/20 flex items-center justify-between px-5">
      <div className="flex items-center gap-3">
        <button onClick={() => setCollapsed((c) => !c)} className="lg:hidden p-2 rounded-xl hover:bg-slate-100">
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-full">
          <Search className="w-4 h-4 text-slate-400" />
          <input placeholder="Quick search..." className="bg-transparent text-sm outline-none w-48 dark:text-white" />
        </div>
      </div>
      <div className="flex items-center gap-1">
        <span className="hidden md:inline text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full mr-2">
          Q2 2026
        </span>
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 relative">
          <Bell className="w-4 h-4" />
          {notifs.filter((n) => !n.read).length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" />
          )}
        </button>
        <button onClick={() => navigate("/profile")} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          <User className="w-4 h-4" />
        </button>
        <button onClick={() => navigate("/headsales/settings")} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          <Settings className="w-4 h-4" />
        </button>
        <button onClick={() => { logout(); navigate("/login"); }} className="p-2 rounded-full hover:bg-rose-50 text-rose-500">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
