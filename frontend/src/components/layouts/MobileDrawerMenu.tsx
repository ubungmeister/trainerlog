import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "components/ui/sheet";
import plan from "assets/plan.png";
import exercises from "assets/exercises.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";
type MobileDrawerMenuProps = {
  onMenuToggle?: () => void;
  isOpen: boolean;
};
export const MobileDrawerMenu = ({
  onMenuToggle,
  isOpen,
}: MobileDrawerMenuProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onMenuToggle?.();
    navigate("/signin");
  };

  return (
    <Sheet open={isOpen} onOpenChange={onMenuToggle}>
      <SheetContent side="right" className="bg-white text-black w-64">
        <SheetHeader className="relative">
          <SheetTitle className="mt-10 mx-1 text-2xl">Menu</SheetTitle>
        </SheetHeader>
        <nav className=" mx-6 flex flex-col gap-4">
          <Link
            onClick={onMenuToggle}
            to="/"
            className="text-lg  flex flex-row gap-4"
          >
            <div className="w-12">
              <img
                src={plan}
                alt="Plan"
                className="w-8 h-8 inline-block mr-2"
              />
            </div>
            <span>Clients</span>
          </Link>
          <Link
            onClick={onMenuToggle}
            to="/exercise-library"
            className="text-lg  flex flex-row gap-4"
          >
            <div className="w-12">
              <img
                src={exercises}
                alt="Exercise Library"
                className="w-10 h-10 inline-block mr-2"
              />
            </div>
            Exercise Library
          </Link>
          <div className="justify-center items-center flex mt-5">
            <button
              onClick={handleLogout}
              className="w-full text-red-600 border border-red-300 hover:border-red-400 hover:bg-red-50 px-4 py-2 rounded-md font-medium transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};
