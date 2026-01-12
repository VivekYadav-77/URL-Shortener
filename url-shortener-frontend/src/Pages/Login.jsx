import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../Features/auth/authapi";
import { useAppSelector } from "../App/hook";
import ThemeToggle  from "../components/ui/ThemeToggle";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const [login, { isLoading, isError, error }] = useLoginMutation();

  const { isAuthenticated, authChecked, user } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (authChecked && isAuthenticated) {
      if (user.role === "admin") navigate("/admin", { replace: true });
      else navigate("/", { replace: true });
    }
  }, [authChecked, isAuthenticated, navigate, user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    login({ email, password });
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">
        Loading...
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen flex items-center justify-center px-4 relative
        bg-liner-to-br from-gray-100 to-gray-200
        dark:bg-linear-to-br dark:from-gray-900 dark:to-black
      "
    >
      {/* THEME TOGGLE */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">

        {/* LOGO + TITLE */}
        <div className="text-center mb-10">
          <div
            className="
              w-16 h-16 mx-auto rounded-2xl
              flex items-center justify-center
              bg-blue-600/10 dark:bg-blue-500/20
              border border-blue-500/20 dark:border-blue-400/20
              shadow-xl backdrop-blur-xl
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
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Sign in to manage your links
          </p>
        </div>

        {/* FORM CARD */}
        <form
          onSubmit={handleSubmit}
          className="
            bg-white/80 dark:bg-gray-800/80
            backdrop-blur-xl border border-gray-300/30 dark:border-gray-700/40
            shadow-2xl rounded-2xl p-8 space-y-6
            transition
          "
        >
          {/* EMAIL */}
          <Input
            label="Email address"
            type="email"
            placeholder="name@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
          />

          {/* PASSWORD */}
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full"
          />

          {/* ERROR MESSAGE */}
          {isError && (
            <div className="flex items-center gap-2 p-3 rounded-lg
              bg-red-50 border border-red-200 text-red-600
              dark:bg-red-900/40 dark:border-red-700 dark:text-red-300"
            >
              <span>⚠</span>
              <p className="text-xs font-semibold">
                {error?.data?.message || "Invalid email or password"}
              </p>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <Button
            type="submit"
            disabled={isLoading}
            className="
              w-full py-3
              bg-blue-600 hover:bg-blue-700
              text-white rounded-lg font-bold
              shadow-lg shadow-blue-500/20
              active:scale-95 transition
            "
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Signing in...
              </div>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        {/* CREATE ACCOUNT LINK */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-blue-600 dark:text-blue-400 font-bold hover:underline underline-offset-4"
            >
              Create new account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
