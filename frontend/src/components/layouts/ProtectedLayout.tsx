import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "hooks/auth/useAuth";

interface ProtectedLayoutProps {
  children?: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { isAuthenticated, isLoading, userName } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-primary-bg text-white p-6">
        <nav className="flex justify-between items-center px-3">
          <h1 className="text-xl font-bold">TrainerLog</h1>
          <h2 className="text-xl font-bold ">{userName}</h2>
        </nav>
      </header>
      <main className="">{children || <Outlet />}</main>
      <footer className="bg-primary-bg text-white p-4 text-center">
        &copy; {new Date().getFullYear()} TrainerLog
      </footer>
    </div>
  );
}
