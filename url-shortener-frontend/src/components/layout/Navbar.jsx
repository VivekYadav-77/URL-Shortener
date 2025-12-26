import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "react";
import { useAppDispatch,useAppSelector
 } from "../../App/hook"; 
import { clearUser } from "../../Features/auth/authSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
    } finally {
      dispatch(clearUser());
      navigate("/login");
    }
  };

  return (
    <nav className="w-full bg-black text-white px-6 py-4 flex justify-between items-center">
      <h1
        className="text-lg font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        URL Shortener
      </h1>

      <div className="flex items-center gap-4">
        <span className="text-sm opacity-80">
          {user?.email}
        </span>

        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="bg-white text-black px-3 py-1 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
