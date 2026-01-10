import { NavLink } from "react-router-dom";

export const UserSidebar = ({ onNavigate }) => {
  const linkClass = ({ isActive }) =>
    `block px-4 py-2.5 rounded-lg font-medium mb-2 transition
     ${
       isActive
         ? "bg-blue-600 text-white"
         : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
     }`;

  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3">
        USER MENU
      </h3>

      <NavLink to="/" end className={linkClass} onClick={onNavigate}>
        Dashboard
      </NavLink>

      <NavLink to="/create" className={linkClass} onClick={onNavigate}>
        Create URL
      </NavLink>

      <NavLink to="/profile" className={linkClass} onClick={onNavigate}>
        Profile
      </NavLink>

      <NavLink to="/history" className={linkClass} onClick={onNavigate}>
        History
      </NavLink>
    </div>
  );
};
