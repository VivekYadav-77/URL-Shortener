import { NavLink, useNavigate } from "react-router-dom";
import {  useLogoutMutation } from "../../Features/auth/authapi";
import { useAppSelector ,useAppDispatch} from "../../App/hook";
import LogoIcon from "../ui/Logo";
import { clearUser } from "../../Features/auth/authSlice";
const Navbar = () => {
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
const user = useAppSelector((state) => state.auth.user);
const dispatch = useAppDispatch()
  const handleLogout = async () => {
    try {
      const d = await logout().unwrap();
      console.log(d)
      dispatch(clearUser)
      navigate("/login");
    } catch {
      console.error("Logout failed")
      
    }
  };

  const navBase = "relative px-1 py-2 text-sm font-medium transition-colors";

  const navActive =
    "text-[#2563EB] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:bg-[#2563EB] after:rounded-full after:content-['']";

  const navInactive = "text-slate-600 hover:text-[#1E293B]";

  return (
    <nav className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          {/* ICON */}
          <div
            className="
      h-9 w-9
      flex items-center justify-center
      text-[#2563EB]
    "
          >
            <LogoIcon />
          </div>

          {/* TEXT */}
          <span className="text-lg font-bold text-[#1E293B]">Shorty</span>
        </div>

        {/* NAV LINKS */}
        <div className="flex items-center gap-8">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${navBase} ${isActive ? navActive : navInactive}`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `${navBase} ${isActive ? navActive : navInactive}`
            }
          >
            Profile
          </NavLink>
          <NavLink to="/history"
           className={({ isActive }) =>
              `${navBase} ${isActive ? navActive : navInactive}`
            }
          >History</NavLink>

        </div>

        {/* USER / ACTIONS */}
        <div className="flex items-center gap-4">
          {/* AVATAR */}
          <div
            onClick={() => navigate("/profile")}
            className="
              h-9 w-9 rounded-full
              bg-[#2563EB] text-white
              flex items-center justify-center
              font-semibold cursor-pointer
              hover:opacity-90 transition
            "
            title={user?.name}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="
               bg-[#eb2525] text-white
                px-3 py-2 rounded-lg
                hover:bg-red-400 transition
                disabled:opacity-50
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
