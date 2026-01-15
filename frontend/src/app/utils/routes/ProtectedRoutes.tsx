import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";
import { PageLoader } from "components/common/PageLoader";
import { ROUTES } from "./routes.constants";

export default function ProtectedRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader message="Checking authentication..." />;
  }

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={ROUTES.AUTH.SIGN_IN} replace />
  );
}
