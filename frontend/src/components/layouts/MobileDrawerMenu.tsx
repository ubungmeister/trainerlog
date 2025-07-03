import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "components/ui/sheet";
import plan from "assets/plan.png";
import categories from "assets/categories.png";
import exercises from "assets/exercises.png";
import settings from "assets/settings.png";
import { Link } from "react-router-dom";
type MobileDrawerMenuProps = {
  onMenuToggle?: () => void;
  isOpen: boolean;
};
export const MobileDrawerMenu = ({
  onMenuToggle,
  isOpen,
}: MobileDrawerMenuProps) => {
  console.log("MobileDrawerMenu rendered");

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
            to="/"
            className="text-lg  flex flex-row gap-4"
          >
            <div className="w-12">
              <img
                src={exercises}
                alt="Exercises"
                className="w-10 h-10 inline-block mr-2"
              />
            </div>
            Exercises
          </Link>
          <Link
            onClick={onMenuToggle}
            to="/categories"
            className="text-lg  flex flex-row gap-4"
          >
            <div className="w-12">
              <img
                src={categories}
                alt="Categories"
                className="w-10 h-10 inline-block mr-2"
              />
            </div>
            Categories
          </Link>
          <Link
            onClick={onMenuToggle}
            to="/"
            className="text-lg  flex flex-row gap-4"
          >
            <div className="w-12">
              <img
                src={settings}
                alt="Settings"
                className="w-8 h-8 inline-block mr-2"
              />
            </div>
            Settings
          </Link>
          <div className="justify-center items-center flex mt-5">
            <button className="text-red-500">Logout</button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};
