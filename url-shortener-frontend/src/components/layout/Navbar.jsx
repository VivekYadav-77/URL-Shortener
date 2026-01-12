import { NavLink, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../Features/auth/authapi";
import { useAppSelector, useAppDispatch } from "../../App/hook";
import LogoIcon from "../ui/Logo";
import { clearUser } from "../../Features/auth/authSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearUser());
      navigate("/login");
    } catch {
      console.error("Logout failed");
    }
  };

  return (
    <nav
      className="
        fixed top-0 left-0 right-0 z-50
        backdrop-blur-xl bg-white/80 dark:bg-gray-900/80
        border-b border-gray-200 dark:border-gray-700
        shadow-sm
      "
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* LEFT — BRAND */}
        <div
          onClick={() =>
            user?.role === "admin" ? navigate("/admin") : navigate("/")
          }
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="h-10 w-10 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <LogoIcon />
          </div>

          <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Shorty
          </span>
        </div>

        {/* RIGHT — PROFILE + LOGOUT */}
        <div className="flex items-center gap-3 sm:gap-4">

          {/* PROFILE ICON */}
          <div
            onClick={() =>
              user?.role === "admin"
                ? navigate("/admin")
                : navigate("/profile")
            }
            className="
              h-9 w-9 sm:h-10 sm:w-10
              rounded-full
              bg-blue-600 dark:bg-blue-500
              text-white flex items-center justify-center
              font-semibold cursor-pointer
              hover:scale-105 transition-all shadow
            "
            title={user?.name}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>

          {/* LOGOUT BUTTON */}
          <button
            onClick={handleLogout}
            className="
              px-3 sm:px-4 py-2
              text-sm font-semibold
              rounded-lg
              bg-red-600 text-white
              hover:bg-red-700
              transition shadow
              whitespace-nowrap
            "
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
