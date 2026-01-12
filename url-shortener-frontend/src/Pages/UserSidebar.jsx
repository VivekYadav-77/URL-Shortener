import { NavLink } from "react-router-dom";
import { X, Home, PlusCircle, User, History } from "lucide-react";

export const UserSidebar = ({ onNavigate }) => {
  const linkClass = ({ isActive }) =>
    `
      flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm
      transition-all duration-200
      ${
        isActive
          ? "bg-blue-600 text-white shadow-md"
          : "text-gray-700 dark:text-gray-300 bg-white/0 hover:bg-gray-200/60 dark:hover:bg-gray-700/60"
      }
    `;

  return (
    <div
      className="
        relative
        backdrop-blur-xl
        bg-white/70 dark:bg-gray-900/50
        border-r border-gray-200 dark:border-gray-700
        shadow-xl
        rounded-r-2xl
        p-4
        h-full
      "
    >
      {/* MOBILE CLOSE BUTTON */}
      <button
        onClick={onNavigate}
        className="
          absolute top-3 right-3 md:hidden
          p-2 rounded-full
          bg-gray-200 dark:bg-gray-700
          text-gray-700 dark:text-gray-200
          hover:bg-gray-300 dark:hover:bg-gray-600
          transition
        "
      >
        <X size={15} />
      </button>

      {/* TITLE */}
      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-4 tracking-wider">
        USER MENU
      </h3>

      {/* NAV LINKS */}
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
