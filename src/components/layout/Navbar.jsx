import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Menu,
  Bell,
  Search,
  Moon,
  Sun,
  LogOut,
  User,
  ChevronDown,
  Settings,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import storage from "../../services/storage.js";

export default function Navbar({ settingsPath = "/profile", onMenuClick, showSearch = true }) {
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

  useEffect(() => {
    const close = () => {
      setShowNotifs(false);
      setShowProfile(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const unread = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80 md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMenuClick?.();
          }}
          data-skip-global-action="true"
          className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {showSearch && (
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Search..."
              className="sfa-input w-72 pl-10"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleTheme();
          }}
          data-skip-global-action="true"
          className="rounded-xl p-2.5 text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowNotifs(!showNotifs);
              setShowProfile(false);
            }}
            data-skip-global-action="true"
            className="relative rounded-xl p-2.5 text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unread > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </button>

          {showNotifs && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-700">
                <span className="text-sm font-semibold text-slate-800 dark:text-white">Notifications</span>
                <button
                  onClick={() => setShowNotifs(false)}
                  data-skip-global-action="true"
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="p-4 text-sm text-slate-500 dark:text-slate-400">No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => storage.markNotificationRead(n.id)}
                      className={`cursor-pointer border-b border-slate-100 p-3 transition-colors hover:bg-slate-50 dark:border-slate-700/50 dark:hover:bg-slate-700/30 ${
                        !n.read ? "bg-primary-50/50 dark:bg-primary-900/10" : ""
                      }`}
                    >
                      <p className="text-sm font-medium text-slate-800 dark:text-white">{n.title}</p>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative ml-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowProfile(!showProfile);
              setShowNotifs(false);
            }}
            data-skip-global-action="true"
            className="flex items-center gap-2 rounded-xl p-1.5 pr-3 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-sm font-bold text-white">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <span className="hidden text-sm font-medium text-slate-700 dark:text-slate-200 sm:block">
              {user?.name || "User"}
            </span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {showProfile && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800"
            >
              <button
                onClick={() => {
                  navigate("/profile");
                  setShowProfile(false);
                }}
                className="flex w-full items-center gap-2 px-4 py-3 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700/50"
              >
                <User className="h-4 w-4" /> Profile
              </button>
              <button
                onClick={() => {
                  navigate(settingsPath);
                  setShowProfile(false);
                }}
                className="flex w-full items-center gap-2 px-4 py-3 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700/50"
              >
                <Settings className="h-4 w-4" /> Settings
              </button>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 border-t border-slate-100 px-4 py-3 text-sm text-rose-600 transition-colors hover:bg-rose-50 dark:border-slate-700 dark:hover:bg-rose-900/20"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
