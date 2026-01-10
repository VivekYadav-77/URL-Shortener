import { NavLink } from "react-router-dom";
import { X } from "lucide-react"; 

export const Sidebar = ({ onNavigate, isMobile }) => {
  const linkClass = ({ isActive }) =>
    `block px-4 py-2.5 rounded-lg font-medium mb-2 
     transition-colors
     ${
       isActive
         ? "bg-blue-600 text-white"
         : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
     }
    `;

  return (
    <div className="relative h-full">
<div className="flex justify-between items-center w-full px-2 mb-2">
  {/* The Heading (Left Corner) */}
  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
    Admin Menu
  </h3>

  {/* The Button (Right Corner) */}
  {isMobile && (
    <button
      onClick={onNavigate}
      className="
        md:hidden
        bg-gray-200 dark:bg-gray-700
        text-gray-700 dark:text-gray-200
        p-2 rounded-md
        hover:bg-gray-300 dark:hover:bg-gray-600
        transition
      "
    >
      <X size={18} />
    </button>
  )}
</div>
      

      <NavLink to="/admin" end className={linkClass}  onClick={onNavigate}>
        Dashboard
      </NavLink>

      <NavLink className={linkClass} to="/admin/users" onClick={onNavigate}>
        Users
      </NavLink>

      <NavLink className={linkClass} to="/admin/urls" onClick={onNavigate}>
        URLs
      </NavLink>

      <NavLink className={linkClass} to="/admin/abuse" onClick={onNavigate}>
        Abuse URLs
      </NavLink>
    </div>
  );
};
