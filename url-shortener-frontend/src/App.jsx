import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useGetMeQuery } from "./Features/auth/authapi";
import { useAppDispatch } from "./App/hook";
import { setUser, clearUser } from "./Features/auth/authSlice";
import CreateUrl from "./Pages/CreateUrl";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import UrlStats from "./Pages/UrlStats";
import AdminRoute from "./components/layout/AdminRoute";
import AdminDashboard from "./Pages/AdminDashboard";
import Profile from "./Pages/Profile";
function App() {
  const dispatch = useAppDispatch();

  const { data, isError,isLoading } = useGetMeQuery();

  useEffect(() => {
     if (data) {
    dispatch(setUser(data));
  }

    if (isError?.status === 401 || isError?.status === 403) {
    dispatch(clearUser());
  }
  }, [data,  isLoading,isError, dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/*AdminRoute */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<CreateUrl />} />
          <Route path="/urls/:id/stats" element={<UrlStats />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
