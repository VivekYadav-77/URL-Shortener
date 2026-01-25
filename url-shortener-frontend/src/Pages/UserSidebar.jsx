import { NavLink } from "react-router-dom";
import { 
  X, 
  Home, 
  PlusCircle, 
  User, 
  History, 
  ChevronRight, 
  Sparkles,
  Link2
} from "lucide-react";
import { useTheme } from "../App/themeStore";

export const UserSidebar = ({ onNavigate, isMobile }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const linkClass = ({ isActive }) =>
    `
      flex items-center justify-between px-4 py-3 rounded-2xl font-bold transition-all duration-300 group mb-2
      ${isActive
        ? isDark 
          ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-[1.02]" 
          : "bg-blue-600 text-white shadow-lg scale-[1.02]"
        : isDark
          ? "text-gray-500 hover:bg-white/5 hover:text-gray-200"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
      }
    `;

  const navItems = [
    { to: "/", label: "Dashboard", icon: <Home size={20} />, end: true },
    { to: "/create", label: "Create URL", icon: <PlusCircle size={20} /> },
    { to: "/profile", label: "My Profile", icon: <User size={20} /> },
    { to: "/history", label: "Link History", icon: <History size={20} /> },
  ];

  return (
    <div className={`
        relative h-full w-full p-6 transition-colors duration-500 flex flex-col
        ${isDark ? "bg-[#0A0A0A] border-r border-white/10" : "bg-white border-r border-gray-200"} rounded-br-lg
      `}>

      {/* BRANDING SECTION */}
      <div className="flex justify-between items-center w-full mb-10 px-2">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30 rotate-3">
            <Link2 size={20} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className={`text-xl font-black tracking-tighter leading-none ${isDark ? "text-white" : "text-gray-900"}`}>
              SHORT<span className="text-blue-600">LY</span>
            </span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">User Portal</span>
          </div>
        </div>

        {isMobile && (
          <button
            onClick={onNavigate}
            className={`p-2 rounded-xl transition-all ${
              isDark ? "bg-white/5 text-gray-400 hover:bg-white/10" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* NAVIGATION LABEL */}
      <div className="px-4 mb-4">
        <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? "text-gray-600" : "text-gray-400"}`}>
          Main Navigation
        </h3>
      </div>

      {/* NAVIGATION LINKS */}
      <nav className="flex-1">
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
                  <span className={`transition-transform duration-300 ${isActive ? "scale-110 text-white" : "group-hover:scale-110"}`}>
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

      {/* FOOTER ACCENT / SYSTEM INFO */}
      <div className="mt-auto">
        <div className={`p-5 rounded-[2rem] border transition-all hover:scale-[1.02] ${
          isDark ? "bg-white/5 border-white/10" : "bg-blue-50 border-blue-100"
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-blue-500" />
            <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-gray-500" : "text-blue-500"}`}>
              Power User
            </p>
          </div>
          <p className={`text-xs font-bold leading-relaxed ${isDark ? "text-gray-400" : "text-blue-900"}`}>
            Ready to optimize more links today?
          </p>
          <div className="mt-3 h-1.5 w-full bg-blue-600/10 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-blue-600 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};