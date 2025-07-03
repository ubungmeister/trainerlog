import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "hooks/auth/useAuth";
import { Menu } from "lucide-react";
import { useState } from "react";
import { MobileDrawerMenu } from "./MobileDrawerMenu";

interface ProtectedLayoutProps {
  children?: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Show loading state while checking authentication
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const onMenuHandler = () => {
    setIsMenuOpen(true);
    // Handle menu click, e.g., toggle a sidebar or open a menu
    console.log("Menu clicked", isMenuOpen);
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-primary-bg text-white p-6">
        <nav className="flex justify-between items-center px-3">
          <h1 className="text-xl font-bold">TrainerLog</h1>
          {isMenuOpen && (
            <MobileDrawerMenu
              onMenuToggle={() => setIsMenuOpen(false)}
              isOpen={isMenuOpen}
            />
          )}
          <Menu onClick={onMenuHandler} className=" text-white" size={30} />
        </nav>
      </header>
      <main className="">{children || <Outlet />}</main>
      <footer className="bg-primary-bg text-white p-4 text-center">
        &copy; {new Date().getFullYear()} TrainerLog
      </footer>
    </div>
  );
}
