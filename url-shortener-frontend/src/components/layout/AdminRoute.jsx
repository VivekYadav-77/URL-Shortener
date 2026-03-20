import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../App/hook";
const AdminRoute = () => {
  const { isAuthenticated, authChecked, user } = useAppSelector(
    (state) => state.auth
  );

  if (!authChecked) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
export default AdminRoute;
