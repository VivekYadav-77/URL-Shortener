import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../Features/auth/authapi";
import { useAppSelector } from "../App/hook";
import ThemeToggle from "../components/ui/ThemeToggle";
import { useTheme } from "../App/themeStore";

const Register = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setUsername] = useState("");
  const [formError, setFormError] = useState("");

  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [register, { isLoading, isSuccess, isError, error }] =
    useRegisterMutation();

  useEffect(() => {
    if (isSuccess) navigate("/login");
  }, [isSuccess, navigate]);

  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  const pageBg = theme === "light" ? "bg-white text-black" : "bg-black text-white";
  const cardBg = theme === "light" ? "bg-white" : "bg-gray-900";
  const border = theme === "light" ? "border-gray-300" : "border-gray-700";
  const softText = theme === "light" ? "text-gray-600" : "text-gray-400";
  const strongText = theme === "light" ? "text-black" : "text-white";
  const inputBg = theme === "light" ? "bg-gray-100" : "bg-gray-800";

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
    <div className={`min-h-screen flex flex-col justify-center items-center px-4 relative ${pageBg} transition-colors`}>

      {/* THEME TOGGLE */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      {/* ICON + HEADING */}
      <div className="text-center mb-8">

        {/* ICON BOX */}
        <div
          className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center bg-blue-600/10 border border-blue-400/30 shadow-lg"
        >
          <svg
            viewBox="-2.4 -2.4 28.80 28.80"
            className="w-12 h-12 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.5,19.5h0a3.54,3.54,0,0,1,0-5L7,12a3.54,3.54,0,0,1,5,0h0a3.54,3.54,0,0,1,0,5L9.5,19.5A3.54,3.54,0,0,1,4.5,19.5Zm13-8L20,9a3.54,3.54,0,0,0,0-5h0a3.54,3.54,0,0,0-5,0L12.5,6.5a3.54,3.54,0,0,0,0,5h0A3.54,3.54,0,0,0,17.5,11.5Z"
              stroke="#1e293b"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <line
              x1="10"
              y1="14"
              x2="14"
              y2="10"
              stroke="#2563eb"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h1 className={`text-3xl font-extrabold mt-4 ${strongText}`}>
          Create Account
        </h1>

        <p className={`${softText} text-sm`}>
          Join Shorty and start creating powerful links
        </p>
      </div>

      {/* FORM CARD */}
      <form
        onSubmit={handleSubmit}
        className={`
          w-full max-w-md rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-xl
          border ${border} ${cardBg} space-y-5 transition-colors
        `}
      >
        {formError && (
          <p className="text-red-500 text-sm font-medium">{formError}</p>
        )}

        {/* USERNAME */}
        <div>
          <label className={`text-sm font-semibold block mb-1 ${strongText}`}>
            Username
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setUsername(e.target.value)}
            className={`
              w-full px-4 py-2.5 rounded-lg border ${border}
              ${inputBg} ${strongText} outline-none
              focus:ring-2 focus:ring-blue-500
            `}
            required
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className={`text-sm font-semibold block mb-1 ${strongText}`}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`
              w-full px-4 py-2.5 rounded-lg border ${border}
              ${inputBg} ${strongText} outline-none
              focus:ring-2 focus:ring-blue-500
            `}
            required
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label className={`text-sm font-semibold block mb-1 ${strongText}`}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`
              w-full px-4 py-2.5 rounded-lg border ${border}
              ${inputBg} ${strongText} outline-none
              focus:ring-2 focus:ring-blue-500
            `}
            required
          />
          <p className={`text-xs mt-1 ${softText}`}>
            Must be at least 8 characters
          </p>
        </div>

        {/* BACKEND ERROR */}
        {isError && (
          <p className="text-red-500 text-sm">
            {error?.data?.message || "Registration failed"}
          </p>
        )}

        {/* REGISTER BUTTON */}
        <button
          type="submit"
          disabled={isLoading}
          className="
            w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700
            text-white font-semibold shadow-md active:scale-95 transition
          "
        >
          {isLoading ? "Creating..." : "Register"}
        </button>

        {/* LOGIN LINK */}
        <p className={`text-center text-sm ${softText}`}>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;
