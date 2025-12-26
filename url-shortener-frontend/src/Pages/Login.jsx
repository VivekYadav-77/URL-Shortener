import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useLoginMutation } from "../Features/auth/authapi.js";
import { useAppDispatch,useAppSelector } from "../App/hook.js"; 
import { setUser } from "../Features/auth/authSlice.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  
  const [
    login,
    { isLoading, isSuccess, isError, error, data }
  ] = useLoginMutation();

  
  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setUser(data.user));
      navigate("/");
    }
  }, [isSuccess, data, dispatch, navigate]);

 
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) return;

    login({ email, password });
  };

 
  if (isAuthenticated) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          Login
        </h1>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Email
          </label>
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
          <label className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* ERROR */}
        {isError && (
          <p className="text-red-600 text-sm mb-4">
            {error?.data?.message || "Login failed"}
          </p>
        )}

        {/* BUTTON */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
