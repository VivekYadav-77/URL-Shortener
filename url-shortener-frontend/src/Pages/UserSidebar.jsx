import { NavLink } from "react-router-dom";
import { X, Home, PlusCircle, User, History } from "lucide-react";
import { useTheme } from "../App/themeStore";

export const UserSidebar = ({ onNavigate }) => {
  const { theme } = useTheme();

  const bg = theme === "light" ? "bg-white text-black" : "bg-black text-white";
  const border = theme === "light" ? "border-gray-300" : "border-gray-700";

  const linkClass = ({ isActive }) => {
    if (isActive) {
      return "flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm bg-blue-600 text-white shadow-md";
    }

    return `
      flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm
      transition-all duration-200
      ${theme === "light" ? "text-black hover:bg-gray-100" : "text-gray-300 hover:bg-gray-800"}
    `;
  };

  const closeBtnBg = theme === "light" ? "bg-gray-200 hover:bg-gray-300 text-black" : "bg-gray-700 hover:bg-gray-600 text-white";

  return (
    <div
      className={`
        relative h-full p-4 rounded-r-2xl shadow-xl
        border-r ${border}
        ${bg}
      `}
    >
      {/* MOBILE CLOSE BUTTON */}
      <button
        onClick={onNavigate}
        className={`absolute top-3 right-3 md:hidden p-2 rounded-full transition ${closeBtnBg}`}
      >
        <X size={16} />
      </button>

      {/* TITLE */}
      <h3
        className={`
          text-xs font-semibold tracking-wider mb-4
          ${theme === "light" ? "text-gray-600" : "text-gray-400"}
        `}
      >
        USER MENU
      </h3>

      {/* NAV */}
      <nav className="flex flex-col gap-2">
        <NavLink to="/" end className={linkClass} onClick={onNavigate}>
          <Home size={18} /> Dashboard
        </NavLink>

        <NavLink to="/create" className={linkClass} onClick={onNavigate}>
          <PlusCircle size={18} /> Create URL
        </NavLink>

        <NavLink to="/profile" className={linkClass} onClick={onNavigate}>
          <User size={18} /> Profile
        </NavLink>

        <NavLink to="/history" className={linkClass} onClick={onNavigate}>
          <History size={18} /> History
        </NavLink>
      </nav>
    </div>
  );
};
