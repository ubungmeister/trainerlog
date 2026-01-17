import { useState } from "react";
import { ChevronDown, ChevronRight, MoreVertical } from "lucide-react";
import { ExerciseItem } from "components/exercise/ExerciseItem";
import type { CategoryGroup } from "utils/groupExercisesByCategory";

interface CategorySectionProps {
  group: CategoryGroup;
  onEditCategory: (categoryId: string) => void;
}

export const CategorySection = ({
  group,
  onEditCategory,
}: CategorySectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="border-b border-primary-button last:border-b-0">
      <div
        className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-500" />
          )}
          <span className="font-semibold text-gray-700">{group.title}</span>
          <span className="text-sm text-gray-500">({group.count})</span>
        </div>

        {/* Menu for categories (not for Uncategorized) */}
        {group.categoryId && (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-8 bg-white border rounded-lg shadow-lg z-20 py-1 min-w-[120px]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onEditCategory(group.categoryId!);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  >
                    Edit
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Exercise List */}
      {isExpanded && (
        <div className="pl-6">
          {group.exercises.length > 0 ? (
            group.exercises.map((exercise) => (
              <ExerciseItem key={exercise.id} exercise={exercise} />
            ))
          ) : (
            <div className="p-3 text-sm text-gray-400 italic">
              No exercises in this category
            </div>
          )}
        </div>
      )}
    </div>
  );
};
