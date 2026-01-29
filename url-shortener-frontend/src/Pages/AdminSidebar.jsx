import { NavLink } from "react-router-dom";
import {
  X,
  LayoutDashboard,
  Users,
  Link2,
  ShieldAlert,
  FileText,
  ChevronRight,
  ShieldBan,
  Info,
} from "lucide-react";
import { useTheme } from "../App/themeStore";

export const Sidebar = ({ onNavigate, isMobile }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const linkClass = ({ isActive }) =>
    `
      flex items-center justify-between px-4 py-3 rounded-2xl font-bold transition-all duration-300 group mb-2
      ${
        isActive
          ? isDark
            ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-[1.02]"
            : "bg-blue-600 text-white shadow-lg scale-[1.02]"
          : isDark
            ? "text-gray-500 hover:bg-white/5 hover:text-gray-200"
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
      }
    `;

  const navItems = [
    {
      to: "/admin",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      end: true,
    },
    { to: "/admin/users", label: "Users", icon: <Users size={20} /> },
    { to: "/admin/urls", label: "URL Management", icon: <Link2 size={20} /> },
    {
      to: "/admin/abuse",
      label: "Abuse Reports",
      icon: <ShieldAlert size={20} />,
    },
    { to: "/admin/logs", label: "System Logs", icon: <FileText size={20} /> },
    {
      to: "/admin/blockeduser",
      label: "Blocked User",
      icon: <ShieldBan size={20} />,
    },
    { to: "/aboutus", label: "Aboutus", icon: <Info size={20} /> },
  ];

  return (
    <div
      className={`
        relative h-full w-full p-6 transition-colors duration-500
        ${isDark ? "bg-[#0A0A0A] border-r border-white/10" : "bg-white border-r border-gray-200"}
      `}
    >
      {/* BRAND / LOGO SECTION */}
      <div className="flex justify-between items-center w-full mb-10 px-2">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
            <Link2 size={18} className="text-white" />
          </div>
          <span
            className={`text-xl font-black tracking-tighter ${isDark ? "text-white" : "text-gray-900"}`}
          >
            ADMIN<span className="text-blue-600">PANEL</span>
          </span>
        </div>

        {isMobile && (
          <button
            onClick={onNavigate}
            className={`p-2 rounded-xl transition-all ${
              isDark
                ? "bg-white/5 text-gray-400 hover:bg-white/10"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* SECTION LABEL */}
      <div className="px-4 mb-4">
        <h3
          className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? "text-gray-600" : "text-gray-400"}`}
        >
          Main Navigation
        </h3>
      </div>

      {/* LINKS CONTAINER */}
      <nav className="flex flex-col">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={linkClass}
            onClick={onNavigate}
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <span
                    className={`transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}
                  >
                    {item.icon}
                  </span>
                  <span className="text-sm tracking-tight">{item.label}</span>
                </div>
                {isActive && <ChevronRight size={14} className="opacity-50" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* FOOTER ACCENT (Optional Decor) */}
      <div className="absolute bottom-8 left-6 right-6">
        <div
          className={`p-4 rounded-2xl border ${isDark ? "bg-white/5 border-white/10" : "bg-blue-50 border-blue-100"}`}
        >
          <p
            className={`text-[10px] font-bold uppercase mb-1 ${isDark ? "text-gray-500" : "text-blue-400"}`}
          >
            System Status
          </p>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span
              className={`text-xs font-black ${isDark ? "text-gray-300" : "text-blue-900"}`}
            >
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
