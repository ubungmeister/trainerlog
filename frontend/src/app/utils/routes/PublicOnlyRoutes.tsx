import { Outlet, Navigate } from "react-router-dom";

const PublicOnlyRoute = () => {
  const isAuthenticated = localStorage.getItem("token") !== null;

  return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default PublicOnlyRoute;
