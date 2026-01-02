import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useGetMeQuery } from "./Features/auth/authapi";
import { useAppDispatch } from "./App/hook";
import { setUser, clearUser } from "./Features/auth/authSlice";
import CreateUrl from "./Pages/CreateUrl";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import UrlStats from "./Pages/UrlStats";
import AdminRoute from "./components/layout/AdminRoute";
import AdminDashboard from "./Pages/AdminDashboard";
import Profile from "./Pages/Profile";
import UserDashboard from "./Pages/Dashboard";
function App() {
  const dispatch = useAppDispatch();

  const { data,isError} = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (data) {
      dispatch(setUser(data));
    }

    if (isError?.status === 401) {
      dispatch(clearUser());
    }
  }, [data,isError, dispatch]);

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
          <Route path="/" element={<UserDashboard />} />
          <Route path="/create" element={<CreateUrl />} />
          <Route path="/urls/:id/stats" element={<UrlStats />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
