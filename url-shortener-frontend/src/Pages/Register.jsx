import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import { useRegisterMutation } from "../Features/auth/authapi";
import { useAppSelector } from "../App/hook";

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
    if (isSuccess) {
      navigate("/login");
    }
  }, [isSuccess, navigate]);

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
    if (!email || !password || !name) return;

    register({ email, password, name });
  };

  if (isAuthenticated) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
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
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>
        {formError && <p className="text-red-600 text-sm mb-4">{formError}</p>}

        {/* USERNAME */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            value={name}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <p className="text-xs text-slate-500 mt-1">**Minimum 3 characters</p>
        </div>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-6">
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <p className="text-xs text-slate-500 mt-1">At least 8 characters</p>
        </div>

        {/* ERROR */}
        {isError && (
          <p className="text-red-600 text-sm mb-4">
            {error?.data?.errors?.[0]?.message ||
              error?.data?.message ||
              "Registration failed"}
          </p>
        )}

        {/* BUTTON */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {isLoading ? "Creating account..." : "Register"}
        </button>

        {/* LINK */}
        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;
