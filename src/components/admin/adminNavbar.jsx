import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Menu, Bell, Search, Moon, Sun, LogOut, User, ChevronDown, Settings,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import storage from "../../services/storage.js";

export default function AdminNavbar({ collapsed, setCollapsed }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const refresh = () => {
      const all = storage.notifications.getAll();
      setNotifications(all.filter((n) => !n.userId || n.userId === user?.id).slice(0, 10));
    };
    refresh();
    return storage.subscribe(refresh);
  }, [user]);

  const unread = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-16 bg-indigo-950/80 backdrop-blur-xl border-b border-indigo-800/50 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button onClick={() => setCollapsed(!collapsed)} className="p-2 rounded-lg hover:bg-white/10 text-indigo-200 lg:hidden">
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
          <input
            placeholder="Search across platform..."
            className="pl-10 pr-4 py-2 w-72 bg-indigo-900/50 border border-indigo-700/50 rounded-xl text-sm text-white placeholder:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={toggleTheme} className="p-2.5 rounded-xl hover:bg-white/10 text-indigo-200 transition-colors">
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="relative">
          <button onClick={() => setShowNotifs(!showNotifs)} className="p-2.5 rounded-xl hover:bg-white/10 text-indigo-200 relative">
            <Bell className="w-5 h-5" />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>
          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-indigo-800 rounded-2xl shadow-2xl overflow-hidden z-50">
              <div className="p-4 border-b border-indigo-800 font-semibold text-white text-sm">Notifications</div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="p-4 text-sm text-indigo-300">No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => storage.markNotificationRead(n.id)}
                      className={`p-3 border-b border-indigo-800/50 cursor-pointer hover:bg-indigo-900/50 ${!n.read ? "bg-indigo-900/30" : ""}`}
                    >
                      <p className="text-sm font-medium text-white">{n.title}</p>
                      <p className="text-xs text-indigo-300 mt-0.5">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-white/10 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-sm font-bold text-white">
              {user?.name?.[0]}
            </div>
            <span className="text-sm font-medium text-indigo-100 hidden sm:block">{user?.name}</span>
            <ChevronDown className="w-4 h-4 text-indigo-300" />
          </button>
          {showProfile && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-indigo-800 rounded-xl shadow-2xl overflow-hidden z-50">
              <button onClick={() => { navigate("/profile"); setShowProfile(false); }} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-indigo-100 hover:bg-indigo-900/50">
                <User className="w-4 h-4" /> Profile
              </button>
              <button onClick={() => { navigate("/admin/settings"); setShowProfile(false); }} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-indigo-100 hover:bg-indigo-900/50">
                <Settings className="w-4 h-4" /> Settings
              </button>
              <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-rose-400 hover:bg-rose-900/20 border-t border-indigo-800">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
