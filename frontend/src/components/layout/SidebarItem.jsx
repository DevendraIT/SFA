import { NavLink } from "react-router-dom";

export default function SidebarItem({
  item,
  collapsed,
}) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `
        flex
        items-center
        gap-3
        rounded-xl
        px-3
        py-3
        transition-all
        duration-200
        ${
          isActive
            ? "bg-blue-600 text-white shadow-sm"
            : "text-slate-600 hover:bg-slate-100"
        }
      `
      }
    >
      <Icon size={20} className="shrink-0" />

      {!collapsed && (
        <span className="text-sm font-medium">
          {item.title}
        </span>
      )}
    </NavLink>
  );
}