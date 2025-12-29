import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../Features/auth/authapi";
import { useAppDispatch, useAppSelector } from "../../App/hook";
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
      <div>
        <svg
            viewBox="-2.4 -2.4 28.80 28.80"
            id="link-alt"
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 mx-auto mb-4" 
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0">
              <path
                transform="translate(-2.4, -2.4), scale(1.7999999999999998)"
                fill="#7ed0ec"
                d="M9.166.33a2.25 2.25 0 00-2.332 0l-5.25 3.182A2.25 2.25 0 00.5 5.436v5.128a2.25 2.25 0 001.084 1.924l5.25 3.182a2.25 2.25 0 002.332 0l5.25-3.182a2.25 2.25 0 001.084-1.924V5.436a2.25 2.25 0 00-1.084-1.924L9.166.33z"
                strokeWidth="0"
              ></path>
            </g>
            <g id="SVGRepo_iconCarrier">
              <path
                id="primary"
                d="M4.5,19.5h0a3.54,3.54,0,0,1,0-5L7,12a3.54,3.54,0,0,1,5,0h0a3.54,3.54,0,0,1,0,5L9.5,19.5A3.54,3.54,0,0,1,4.5,19.5Zm13-8L20,9a3.54,3.54,0,0,0,0-5h0a3.54,3.54,0,0,0-5,0L12.5,6.5a3.54,3.54,0,0,0,0,5h0A3.54,3.54,0,0,0,17.5,11.5Z"
                style={{
                  fill: "none",
                  stroke: "#1e293b",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                }}
              ></path>
              <line
                id="secondary"
                x1="10"
                y1="14"
                x2="14"
                y2="10"
                style={{
                  fill: "none",
                  stroke: "#2563eb",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                }}
              ></line>
            </g>
          </svg>
      <h1
        className="text-lg font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        URL Shortener
      </h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm opacity-80">{user?.email}</span>
        <button
          onClick={() => navigate("/")}
          className="text-sm underline"
        >
          Home
        </button>
        <button
          onClick={() => navigate("/profile")}
          className="text-sm underline"
        >
          Profile
        </button>

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
