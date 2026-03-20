import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../App/hook";
import ServerWakingLoader from "./ServerWakingLoader";
const ProtectedRoute = () => {
  const { isAuthenticated, authChecked, user } = useAppSelector(
    (state) => state.auth,
  );

  if (!authChecked) {
      return <ServerWakingLoader/>
  }
  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
