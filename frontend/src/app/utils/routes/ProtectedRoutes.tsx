import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
    const isAuthenticated = localStorage.getItem("token") !== null
    return isAuthenticated ? <Outlet /> : <Navigate to="/auth/signin" replace />;
    
};

export default ProtectedRoutes;