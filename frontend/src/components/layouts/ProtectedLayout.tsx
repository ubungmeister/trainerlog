import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "hooks/useAuth";
import { Menu } from "lucide-react";
import { useState } from "react";
import { MobileDrawerMenu } from "./MobileDrawerMenu";
import { BottomNavigation } from "./BottomNavigation";

interface ProtectedLayoutProps {
  children?: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const onMenuHandler = () => {
    setIsMenuOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 max-w-lg mx-auto relative">
      <header className="bg-white sticky top-0 z-40 px-4 py-3 shadow-sm">
        <nav className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">TrainerLog</h1>
          {isMenuOpen && (
            <MobileDrawerMenu onMenuToggle={() => setIsMenuOpen(false)} isOpen={isMenuOpen} />
          )}
          <button
            onClick={onMenuHandler}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="text-gray-700" size={24} />
          </button>
        </nav>
      </header>
      <main className="flex-1 pb-20 overflow-auto">{children || <Outlet />}</main>
      <BottomNavigation />
    </div>
  );
}
