import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../App/hook";

const ProtectedRoute = () => {
  const { isAuthenticated, authChecked } = useAppSelector(
    (state) => state.auth
  );

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
