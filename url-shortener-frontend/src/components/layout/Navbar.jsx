import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../Features/auth/authapi";
import { useAppSelector, useAppDispatch } from "../../App/hook";
import { clearUser } from "../../Features/auth/authSlice";
import LogoIcon from "../ui/Logo";
import { LogOut, User as UserIcon, Settings, ChevronDown } from "lucide-react";
import { useTheme } from "../../App/themeStore";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const user = useAppSelector((state) => state.auth.user);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearUser());
      navigate("/login");
    } catch {
      console.error("Logout failed");
    }
  };

  const handleBrandClick = () => {
    user?.role === "admin" ? navigate("/admin") : navigate("/");
  };

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-100 h-20
        backdrop-blur-2xl transition-all duration-500
        border-b ${isDark ? "bg-[#0A0A0A]/70 border-white/10" : "bg-white/80 border-gray-200 shadow-sm"}
      `}
    >
      <div className="max-w-400 mx-auto px-6 h-full flex items-center justify-between">
        {/* LEFT — BRANDING */}
        <div
          onClick={handleBrandClick}
          className="group flex items-center gap-3 cursor-pointer select-none"
        >
          <div className="h-10 w-10 flex items-center justify-center transition-transform group-hover:scale-110 group-active:scale-95">
            <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/30">
              <LogoIcon className="text-white" />
            </div>
          </div>

          <div className="flex flex-col">
            <span
              className={`text-2xl font-black tracking-tighter leading-none ${isDark ? "text-white" : "text-gray-900"}`}
            >
              SHORT<span className="text-blue-600">LY</span>
            </span>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 opacity-80">
              {user?.role === "admin" ? "Management Suite" : "Link Optimizer"}
            </span>
          </div>
        </div>

        {/* RIGHT — ACTIONS */}
        <div className="flex items-center gap-4">
          {/* USER PROFILE PILL */}
          <div
            onClick={() =>
              user?.role === "admin"
                ? navigate("/admin/profile")
                : navigate("/profile")
            }
            className={`
              flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-2xl cursor-pointer transition-all active:scale-95
              border ${isDark ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-gray-100 border-gray-200 hover:bg-gray-200"}
            `}
          >
            <div
              className={`
              h-8 w-8 rounded-xl flex items-center justify-center font-black text-sm shadow-md
              ${isDark ? "bg-linear-to-br from-blue-600 to-purple-600 text-white" : "bg-blue-600 text-white"}
            `}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>

            <div className="hidden sm:flex flex-col text-left">
              <span
                className={`text-xs font-black truncate max-w-25 ${isDark ? "text-gray-200" : "text-gray-900"}`}
              >
                {user?.name || "User"}
              </span>
              <span className="text-[9px] font-bold text-blue-500 uppercase tracking-wider">
                View Account
              </span>
            </div>
            <ChevronDown size={14} className="text-gray-500" />
          </div>

          {/* VERTICAL DIVIDER */}
          <div
            className={`h-8 w-px ${isDark ? "bg-white/10" : "bg-gray-200"}`}
          />

          {/* LOGOUT BUTTON */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest
              transition-all active:scale-95 shadow-lg shadow-red-600/10
              ${
                isDark
                  ? "bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20"
                  : "bg-red-600 text-white hover:bg-red-700"
              }
              disabled:opacity-50
            `}
          >
            {isLoggingOut ? (
              <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span className="hidden md:inline">Logout</span>
                <LogOut size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
