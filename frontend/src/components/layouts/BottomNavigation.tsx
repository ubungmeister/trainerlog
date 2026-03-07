import { NavLink } from "react-router-dom";
import { Users, Dumbbell, Calendar } from "lucide-react";

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    to: "/",
    label: "Clients",
    icon: <Users size={24} />,
  },
  {
    to: "/sessions",
    label: "Sessions",
    icon: <Calendar size={24} />,
  },
  {
    to: "/exercise-library",
    label: "Workouts",
    icon: <Dumbbell size={24} />,
  },
];

export function BottomNavigation() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white border-t border-gray-200 safe-area-bottom z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? "text-green-800" : "text-gray-500 hover:text-gray-700"
              }`
            }
          >
            {item.icon}
            <span className="text-xs mt-1 font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
