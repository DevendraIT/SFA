import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Bell, Sun, Moon, LogOut, User, Menu, MapPin } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import storage from "../../services/storage.js";

export default function SalesPersonNavbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const refresh = () => {
      const notifs = storage.notifications.getAll().filter(
        (n) => n.userId === user?.id && !n.read
      );
      setUnread(notifs.length);
    };
    refresh();
    return storage.subscribe(refresh);
  }, [user]);

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-orange-500 to-green-500 text-white px-4 py-3 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onMenuClick} className="md:hidden p-1.5 rounded-xl bg-white/20">
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <p className="text-xs text-orange-100 font-medium">Good {new Date().getHours() < 12 ? "Morning" : "Afternoon"} 👋</p>
            <h1 className="font-black text-lg leading-tight">{user?.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 text-xs font-bold">
            <MapPin className="w-3 h-3" /> Live
          </button>
          <button onClick={toggleTheme} className="p-2 rounded-full bg-white/15">
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button onClick={() => navigate("/salesperson/notifications")} className="p-2 rounded-full bg-white/15 relative">
            <Bell className="w-4 h-4" />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-[9px] font-bold rounded-full flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>
          <button onClick={() => navigate("/profile")} className="p-2 rounded-full bg-white/15">
            <User className="w-4 h-4" />
          </button>
          <button onClick={() => { logout(); navigate("/login"); }} className="p-2 rounded-full bg-white/15">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
