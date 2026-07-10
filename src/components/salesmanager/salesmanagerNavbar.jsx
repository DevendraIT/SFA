import { useNavigate } from "react-router";
import { Bell, Moon, Sun, LogOut, User, Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";

export default function SalesManagerNavbar({ setSidebarOpen }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-purple-950/90 backdrop-blur border-b border-cyan-500/20 flex items-center justify-between px-5">
      <div className="flex items-center gap-3">
        <button onClick={() => setSidebarOpen((o) => !o)} className="p-2 rounded-lg bg-purple-800/50 text-cyan-300 lg:hidden">
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-white">Team Command Center</h1>
          <p className="text-xs text-cyan-400">Manage your sales operations</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={toggleTheme} className="p-2 rounded-lg bg-purple-800/50 text-cyan-300 hover:bg-purple-700/50">
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <button className="p-2 rounded-lg bg-purple-800/50 text-cyan-300 hover:bg-purple-700/50 relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
        </button>
        <button onClick={() => navigate("/profile")} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-200 text-sm font-medium">
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">{user?.name}</span>
        </button>
        <button onClick={() => { logout(); navigate("/login"); }} className="p-2 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
