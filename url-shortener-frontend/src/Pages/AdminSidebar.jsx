import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { useTheme } from "../App/themeStore";

export const Sidebar = ({ onNavigate, isMobile }) => {
  const { theme } = useTheme();

  const textNormal = theme === "light" ? "text-gray-800" : "text-gray-300";
  const textMuted = theme === "light" ? "text-gray-500" : "text-gray-400";
  const hoverBg = theme === "light" ? "hover:bg-gray-200" : "hover:bg-gray-700";
  const closeBtnBg = theme === "light" ? "bg-gray-200" : "bg-gray-700";
  const closeBtnHover = theme === "light" ? "hover:bg-gray-300" : "hover:bg-gray-600";
  const bg = theme === "light" ? "bg-white text-black" : "bg-black text-white";
  const border = theme === "light" ? "border-gray-300" : "border-gray-700";

  const linkClass = ({ isActive }) =>
    `
      block px-4 py-2.5 rounded-lg font-medium mb-2 transition
      ${isActive
        ? "bg-blue-600 text-white"
        : `${textNormal} ${hoverBg}`
      }
    `;

  return (
    <div className={`
        relative h-full w-full p-4 rounded-r-2xl shadow-xl
        border-r ${border}
        ${bg}
      `}>

      {/* HEADER ROW */}
      <div className="flex justify-between items-center w-full px-2 mb-2">
        <h3 className={`text-xs font-semibold uppercase tracking-wider ${textMuted}`}>
          Admin Menu
        </h3>

        {isMobile && (
          <button
            onClick={onNavigate}
            className={`
              md:hidden p-2 rounded-md transition
              ${closeBtnBg} ${closeBtnHover}
              ${textNormal}
            `}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* LINKS */}
      <NavLink to="/admin" end className={linkClass} onClick={onNavigate}>
        Dashboard
      </NavLink>

      <NavLink to="/admin/users" className={linkClass} onClick={onNavigate}>
        Users
      </NavLink>

      <NavLink to="/admin/urls" className={linkClass} onClick={onNavigate}>
        URLs
      </NavLink>

      <NavLink to="/admin/abuse" className={linkClass} onClick={onNavigate}>
        Abuse URLs
      </NavLink>
    </div>
  );
};
