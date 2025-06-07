import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
    const isAuthenticated = localStorage.getItem("token") !== null
    console.log("ProtectedRoutes: isAuthenticated", isAuthenticated);
    return isAuthenticated ? <Outlet /> : <Navigate to="/auth/signin" replace />;
    
};

export default ProtectedRoutes;