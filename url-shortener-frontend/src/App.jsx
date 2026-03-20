import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import { useGetMeQuery } from "./Features/auth/authApi";
import { useAppDispatch } from "./App/hook";
import { useAppSelector } from "./App/hook";
import { setUser, clearUser, markAuthChecked } from "./Features/auth/authSlice";
import CreateUrl from "./Pages/CreateUrl";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import UrlStats from "./Pages/UrlStats";
import AdminRoute from "./components/layout/AdminRoute";
import AdminDashboard from "./Pages/AdminDashboard";
import Profile from "./Pages/Profile";
import UserDashboard from "./Pages/Dashboard";
import History from "./Pages/UrlsHistory";
import AdminUsersPage from "./Pages/AdminUsersPage";
import AdminUserProfile from "./Pages/AdminUserProfile";
import AdminUrls from "./Pages/AdminUrl";
import AdminAbuseUrls from "./Pages/AdminAbuseUrl";
import AdminSecurityLogsPage from "./Pages/AdminSecurityLogsPage";
import VerifyEmail from "./Pages/VerifyEmail";
import ResetPassword from "./Pages/ResetPassword";
import SpaceNotFound from "./Pages/NotFoundPage";
import AdminBlockedUsersPage from "./Pages/AdminBlockedUsers";
import { ForgotPassword } from "./Pages/ForgotPassword";
import AboutUs from "./Pages/Aboutus";
import AdminProfile from "./Pages/AdminProfilePage";
import ContactMePage from "./Pages/ContactUs";
import UserSessionsPage from "./Pages/AdminUserSessionsPage";
function App() {
  const dispatch = useAppDispatch();

  const { data, isSuccess, isError, isloading } = useGetMeQuery();
  useEffect(() => {
  if (isSuccess && data) {
    dispatch(setUser(data));
    dispatch(markAuthChecked());
  } else if (isError) {
    dispatch(markAuthChecked());
  }
}, [isSuccess, isError, data, dispatch]);
useEffect(() => {
  fetch(`${import.meta.env.VITE_B_LOCATION}/health`, {
    credentials: "include",
  }).catch(() => {});
}, []);
 
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contactus" element={<ContactMePage />} />

        {/*AdminRoute */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/users/:id" element={<AdminUserProfile />} />
          <Route path="/admin/urls" element={<AdminUrls />} />
          <Route path="/admin/abuse" element={<AdminAbuseUrls />} />
          <Route path="/admin/logs" element={<AdminSecurityLogsPage />} />
          <Route
            path="/admin/blockeduser"
            element={<AdminBlockedUsersPage />}
          />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/sessions" element={<UserSessionsPage />} />

        </Route>
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<UserDashboard />} />
          <Route path="/create" element={<CreateUrl />} />
          <Route path="/history" element={<History />} />
          <Route path="/urls/:id/stats" element={<UrlStats />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<SpaceNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
