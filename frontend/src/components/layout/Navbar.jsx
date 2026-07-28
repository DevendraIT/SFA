import { useState, useEffect } from "react";
import { Search, Bell, Menu, ChevronDown, CheckCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useAuth } from "../../context/AuthContext";
import notificationsApi from "../../api/notifications.api";

export default function Navbar({
  collapsed,
  setCollapsed,
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [openProfile, setOpenProfile] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = async () => {
    try {
      const res = await notificationsApi.getMyNotifications();
      const data = res.data?.data || res.data;
      const unreadList = Array.isArray(data?.unread) ? data.unread : [];
      const allList = Array.isArray(data?.all) ? data.all : [];
      setNotifications(allList.length > 0 ? allList : unreadList);
      setUnreadCount(data?.unreadCount ?? unreadList.length);
    } catch (e) {
      console.warn("Failed to load notifications:", e);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 15000); // Polling every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id, referenceType, referenceId) => {
    try {
      await notificationsApi.markAsRead(id);
      loadNotifications();
      setOpenNotifications(false);

      if (referenceType === "TASK" && referenceId) {
        navigate(`/field-force/tasks/${referenceId}/execute`);
      } else if (referenceType === "VISIT" && referenceId) {
        navigate(`/field-force/visits/${referenceId}`);
      } else {
        navigate("/notifications");
      }
    } catch (e) {
      console.warn("Mark read error:", e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      loadNotifications();
    } catch (e) {
      console.warn("Mark all read error:", e);
    }
  };

  const fullName =
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
    "User";

  const role =
  Array.isArray(user?.roles) &&
  user.roles.length > 0
    ? user.roles[0]?.role?.name
    : "User";

  return (
    <header className="h-18 bg-white border-b border-slate-200 px-6 flex items-center justify-between relative z-40">

      {/* Left */}

      <div className="flex items-center gap-4">

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-2 hover:bg-slate-100 transition"
        >
          <Menu size={20} />
        </button>

        <div>

          <h1 className="text-xl font-semibold text-slate-800">
            Sales Force Automation
          </h1>

          <p className="text-xs text-slate-500">
            Enterprise Dashboard
          </p>

        </div>

      </div>

      {/* Center */}

      <div className="hidden lg:flex w-full max-w-xl mx-10">

        <div className="relative w-full">

          <Search
            size={18}
            className="absolute left-4 top-3.5 text-slate-400"
          />

          <input
            placeholder="Search missions, visits, team members..."
            className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm"
          />

        </div>

      </div>

      {/* Right */}

      <div className="flex items-center gap-5">

        {/* Notifications Icon & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setOpenNotifications(!openNotifications);
              setOpenProfile(false);
            }}
            className="relative rounded-xl p-2.5 hover:bg-slate-100 transition"
          >
            <Bell size={21} className="text-slate-700" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-5 min-w-[20px] px-1 rounded-full bg-red-500 text-white font-extrabold text-[10px] flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {openNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white shadow-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/80">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition flex items-center gap-1"
                  >
                    <CheckCheck size={14} /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    No notifications right now.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleMarkAsRead(n.id, n.referenceType, n.referenceId)}
                      className={`p-4 transition cursor-pointer hover:bg-slate-50 ${
                        n.status === "UNREAD" ? "bg-blue-50/50 font-medium" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {dayjs(n.createdAt).format("h:mm A")}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{n.message}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
                <button
                  onClick={() => {
                    setOpenNotifications(false);
                    navigate("/notifications");
                  }}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative">

          <button
            onClick={() => {
              setOpenProfile(!openProfile);
              setOpenNotifications(false);
            }}
            className="flex items-center gap-3 rounded-xl px-2 py-1 hover:bg-slate-100 transition"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white font-bold">

              {fullName.charAt(0)}

            </div>

            <div className="hidden md:block text-left">

              <p className="font-semibold text-sm">

                {fullName}

              </p>

              <p className="text-xs text-slate-500">

                {role}

              </p>

            </div>

            <ChevronDown size={18} />

          </button>

                    {openProfile && (

            <div className="absolute right-0 mt-3 w-60 rounded-2xl border border-slate-200 bg-white shadow-xl z-50">

              <div className="border-b p-5">

                <p className="font-semibold">

                  {fullName}

                </p>

                <p className="text-sm text-slate-500">

                  {user?.email}

                </p>

              </div>

              <button
                onClick={logout}
                className="w-full text-left px-5 py-4 hover:bg-red-50 hover:text-red-600 transition"
              >

                Logout

              </button>

            </div>

          )}

        </div>

      </div>

    </header>
  );
}