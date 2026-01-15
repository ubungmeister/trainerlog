import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";
import { PageLoader } from "components/common/PageLoader";
import { ROUTES } from "./routes.constants";

export default function PublicOnlyRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  return !isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.HOME} replace />;
}
