import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useGetMeQuery } from "./Features/auth/authapi";
import { useAppDispatch,useAppSelector } from "./App/hook";
import { setUser, clearUser ,markAuthChecked} from "./Features/auth/authSlice";
import CreateUrl from "./Pages/CreateUrl";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import UrlStats from "./Pages/UrlStats";
import AdminRoute from "./components/layout/AdminRoute";
import AdminDashboard from "./Pages/AdminDashboard";
import Profile from "./Pages/Profile";
import UserDashboard from "./Pages/Dashboard";
import History from "./Pages/UrlsHistory";
function App() {
  const dispatch = useAppDispatch();

  const { data, isSuccess, isError } = useGetMeQuery();

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setUser(data));
    } else if (isError) {
      dispatch(clearUser());
    }
  }, [isSuccess, isError, data, dispatch]);
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
          <Route path="/history" element={<History />} />
          <Route path="/urls/:id/stats" element={<UrlStats />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
