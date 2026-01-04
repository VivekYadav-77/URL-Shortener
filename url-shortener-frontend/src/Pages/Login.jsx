import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import { useLoginMutation ,useGetMeQuery} from "../Features/auth/authapi.js";
import { useAppDispatch, useAppSelector } from "../App/hook.js";
import { setUser } from "../Features/auth/authSlice.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const [login, { isLoading, isError, error, isSuccess }] = useLoginMutation();
const { data: me } = useGetMeQuery(undefined, {
  skip: !isSuccess,
});

  
useEffect(() => {
  if (me) {
    dispatch(setUser(me));
    navigate("/", { replace: true });
  }
}, [me, dispatch, navigate]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    login({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 font-sans">
      <div className="w-full max-w-md">
        {/* Brand Section */}
        <div className="mb-10 text-center">
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
          <h1 className="text-3xl font-extrabold text-[#1E293B] tracking-tight">
            Welcome back
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Login to manage your short links
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 space-y-5"
        >
          <div className="space-y-4">
            <Input
              label="Email address"
              placeholder="name@gmail.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="focus:ring-2 focus:ring-blue-500 transition-all"
            />

            <div className="space-y-1">
              <div className="flex justify-between items-center">
              </div>
              <Input
                label="Password"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Error Message with Icon */}
          {isError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 animate-shake">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-xs font-semibold">
                {error?.data?.message || "Invalid email or password"}
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg font-bold shadow-md shadow-blue-100 active:scale-[0.98] transition-all flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        {/* Secondary Action */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Don’t have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-[#2563EB] font-bold hover:underline underline-offset-4"
            >
              Create free account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
