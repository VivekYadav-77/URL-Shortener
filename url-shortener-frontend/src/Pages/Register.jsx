import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../Features/auth/authapi";
import { useAppSelector } from "../App/hook";
import  ThemeToggle  from "../components/ui/ThemeToggle";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setUsername] = useState("");
  const [formError, setFormError] = useState("");

  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [register, { isLoading, isSuccess, isError, error }] =
    useRegisterMutation();

  useEffect(() => {
    if (isSuccess) navigate("/login");
  }, [isSuccess, navigate]);

  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    if (name.length < 3) {
      setFormError("Username must be at least 3 characters long");
      return;
    }
    if (password.length < 8) {
      setFormError("Password must be at least 8 characters long");
      return;
    }

    register({ email, password, name });
  };

  return (
    <div
      className="
        min-h-screen 
        flex flex-col justify-center items-center 
        px-4 relative
        bg-linear-to-br from-gray-100 to-gray-200
        dark:bg--to-br dark:from-gray-900 dark:to-gray-950
      "
    >

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      {/* ICON + HEADING */}
      <div className="text-center mb-8">
        <div
          className="
            w-16 h-16 mx-auto rounded-2xl
            flex items-center justify-center
            bg-blue-600/10 dark:bg-blue-500/20
            border border-blue-500/20 dark:border-blue-400/20
            shadow-lg backdrop-blur-xl
          "
        >
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
        </div>

        <h1 className="text-3xl font-extrabold mt-4 text-gray-900 dark:text-white">
          Create Account
        </h1>

        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Join Shorty and start creating powerful links
        </p>
      </div>

      {/* FORM CARD */}
      <form
        onSubmit={handleSubmit}
        className="
          w-full max-w-md
          rounded-2xl p-6 sm:p-8
          shadow-2xl backdrop-blur-xl
          border border-gray-300/30 dark:border-gray-700/40
          bg-white/80 dark:bg-gray-800/70
          space-y-5 transition
        "
      >
        {formError && (
          <p className="text-red-500 text-sm font-medium">{formError}</p>
        )}

        {/* USERNAME */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">
            Username
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setUsername(e.target.value)}
            className="
              w-full px-4 py-2.5 rounded-lg
              bg-gray-100 dark:bg-gray-900/60
              border border-gray-300 dark:border-gray-700
              text-gray-800 dark:text-gray-200
              focus:ring-2 focus:ring-blue-500
              outline-none
            "
            required
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-full px-4 py-2.5 rounded-lg
              bg-gray-100 dark:bg-gray-900/60
              border border-gray-300 dark:border-gray-700
              text-gray-800 dark:text-gray-200
              focus:ring-2 focus:ring-blue-500
              outline-none
            "
            required
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full px-4 py-2.5 rounded-lg
              bg-gray-100 dark:bg-gray-900/60
              border border-gray-300 dark:border-gray-700
              text-gray-800 dark:text-gray-200
              focus:ring-2 focus:ring-blue-500
              outline-none
            "
            required
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Must be at least 8 characters
          </p>
        </div>

        {/* BACKEND ERROR */}
        {isError && (
          <p className="text-red-500 text-sm">
            {error?.data?.message || "Registration failed"}
          </p>
        )}

        {/* BUTTON */}
        <button
          type="submit"
          disabled={isLoading}
          className="
            w-full py-3 rounded-lg
            bg-blue-600 hover:bg-blue-700
            text-white font-semibold
            shadow-md shadow-blue-500/20
            active:scale-95
            transition
          "
        >
          {isLoading ? "Creating..." : "Register"}
        </button>

        {/* LOGIN LINK */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 dark:text-blue-400 cursor-pointer"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;
