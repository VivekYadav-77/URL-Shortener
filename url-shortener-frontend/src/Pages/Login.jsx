import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../Features/auth/authapi";
import { useAppDispatch, useAppSelector } from "../App/hook";
import ThemeToggle from "../components/ui/ThemeToggle";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { setUser } from "../Features/auth/authSlice";
import { useTheme } from "../App/themeStore";

const Login = () => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { isAuthenticated, authChecked, user } = useAppSelector(
    (state) => state.auth
  );

  const [login, { isLoading, isError, error }] = useLoginMutation();

  const pageBg = theme === "light" ? "bg-white text-black" : "bg-black text-white";
  const cardBg = theme === "light" ? "bg-white" : "bg-gray-900";
  const border = theme === "light" ? "border-gray-300" : "border-gray-700";
  const softText = theme === "light" ? "text-gray-600" : "text-gray-400";
  const strongText = theme === "light" ? "text-black" : "text-white";
  const logoBg = theme === "light" ? "bg-blue-100" : "bg-blue-900/30";

  useEffect(() => {
    if (authChecked && isAuthenticated) {
      navigate(user.role === "admin" ? "/admin" : "/", { replace: true });
    }
  }, [authChecked, isAuthenticated, navigate, user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;

    login({ email, password })
      .unwrap()
      .then((res) => {
        dispatch(setUser(res.user));
        navigate(res.user.role === "admin" ? "/admin" : "/", { replace: true });
      });
  };

  if (!authChecked) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${pageBg}`}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 relative transition-colors ${pageBg}`}
    >
      {/* THEME TOGGLE */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      {/* CONTENT WRAPPER */}
      <div className="w-full max-w-md">

        {/* LOGO + TITLE */}
        <div className="text-center mb-10">
          <div
            className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center border shadow-lg ${logoBg} ${border}`}
          >
            <svg
              viewBox="-2.4 -2.4 28.80 28.80"
              id="link-alt"
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 mx-auto mb-4"
            >
              <g strokeWidth="0">
                <path
                  transform="translate(-2.4, -2.4) scale(1.8)"
                  fill="#7ed0ec"
                  d="M9.166.33a2.25 2.25 0 00-2.332 0l-5.25 3.182A2.25 2.25 0 00.5 5.436v5.128a2.25 2.25 0 001.084 1.924l5.25 3.182a2.25 2.25 0 002.332 0l5.25-3.182a2.25 2.25 0 001.084-1.924V5.436a2.25 2.25 0 00-1.084-1.924L9.166.33z"
                ></path>
              </g>
              <g>
                <path
                  d="M4.5,19.5a3.54,3.54,0,0,1,0-5L7,12a3.54,3.54,0,0,1,5,0,3.54,3.54,0,0,1,0,5L9.5,19.5A3.54,3.54,0,0,1,4.5,19.5Zm13-8a3.54,3.54,0,0,0,0-5,3.54,3.54,0,0,0-5,0L12.5,6.5a3.54,3.54,0,0,0,0,5,3.54,3.54,0,0,0,5,0Z"
                  stroke="#1e293b"
                  strokeWidth="2"
                  strokeLinecap="round"
                ></path>
                <line
                  x1="10"
                  y1="14"
                  x2="14"
                  y2="10"
                  stroke="#2563eb"
                  strokeWidth="2"
                  strokeLinecap="round"
                ></line>
              </g>
            </svg>
          </div>

          <h1 className={`text-3xl font-extrabold mt-4 ${strongText}`}>
            Welcome Back
          </h1>
          <p className={`text-sm mt-1 ${softText}`}>
            Sign in to manage your links
          </p>
        </div>

        {/* FORM CARD */}
        <form
          onSubmit={handleSubmit}
          className={`rounded-2xl p-8 shadow-xl border space-y-6 transition ${cardBg} ${border}`}
        >
          {/* EMAIL */}
          <Input
            label="Email address"
            type="email"
            placeholder="name@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            theme={theme}
          />

          {/* PASSWORD */}
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            theme={theme}
          />

          {/* ERROR */}
          {isError && (
            <div
              className={`
                flex items-center gap-2 p-3 rounded-lg border text-sm font-medium
                ${theme === "light"
                  ? "bg-red-100 text-red-700 border-red-300"
                  : "bg-red-900/30 text-red-300 border-red-700"}
              `}
            >
              ⚠ {error?.data?.message || "Invalid email or password"}
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg shadow-blue-500/20 active:scale-95"
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
          <p className={`text-sm ${softText}`}>
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-blue-600 font-bold hover:underline underline-offset-4"
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
