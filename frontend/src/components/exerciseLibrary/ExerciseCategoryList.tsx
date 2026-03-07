import { useGetAllExercises, useGetAllCategories } from "hooks/trainingTable";
import { DataLoading, StateFilter } from "components/ui";
import { exerciseModalStore } from "app/store/exercise";
import { useEffect, useMemo } from "react";
import type { Category, Exercise } from "types/tableType";
import { categoryModalStore } from "app/store/category";
import { groupExercisesByCategory } from "utils";
import { CategorySection } from "components/category";

export const ExerciseCategoryList = () => {
  const { data: categories, isLoading: isCategoryLoading } = useGetAllCategories();
  const { data: exercises, isLoading: isExerciseLoading } = useGetAllExercises();

  const openCategoryModal = categoryModalStore((state) => state.openModal);

  const setCategoriesForCategoryModal = categoryModalStore((state) => state.setCategories);
  const openExerciseModal = exerciseModalStore((state) => state.openModal);
  const filterState = exerciseModalStore((state) => state.filterState);
  const setFilterState = exerciseModalStore((state) => state.setFilterState);
  const setExercises = exerciseModalStore((state) => state.setExercises);
  const setCategoriesForExerciseModal = exerciseModalStore((state) => state.setCategories);

  useEffect(() => {
    if (categories) {
      setCategoriesForCategoryModal(categories);
      setCategoriesForExerciseModal(categories);
    }
  }, [categories, setCategoriesForCategoryModal, setCategoriesForExerciseModal]);

  useEffect(() => {
    if (exercises) setExercises(exercises);
  }, [exercises, setExercises]);

  const filteredExercises = useMemo(() => {
    if (!exercises) return [];
    return exercises.filter((exercise: Exercise) => {
      if (!exercise.sharedExercise) return false;
      if (filterState === "all") return true;
      if (filterState === "active") return exercise.activeExercise;
      if (filterState === "inactive") return !exercise.activeExercise;
      return true;
    });
  }, [exercises, filterState]);

  const groupedExercises = useMemo(() => {
    return groupExercisesByCategory(filteredExercises, categories ?? []);
  }, [filteredExercises, categories]);

  const handleEditCategory = (categoryId: string) => {
    const category = categories?.find((c: Category) => c.id === categoryId);
    if (category) {
      openCategoryModal(category);
    }
  };

  if (isCategoryLoading || isExerciseLoading) {
    return <DataLoading />;
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Exercises Library</h1>
        <button
          onClick={() => openExerciseModal()}
          className="flex items-center gap-2 bg-primary-bg hover:bg-primary-bg/90 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
        >
          Add Exercise
        </button>
      </div>

      <div className="mb-4">
        <StateFilter filterState={filterState} setFilterState={setFilterState} />
      </div>

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
        {groupedExercises.length > 0 ? (
          groupedExercises.map((group) => (
            <CategorySection
              key={group.categoryId ?? "uncategorized"}
              group={group}
              onEditCategory={handleEditCategory}
            />
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">No exercises found</div>
        )}
      </div>

      <div className="mt-4">
        <button
          onClick={() => openCategoryModal()}
          className="text-primary-bg hover:text-primary-bg/80 font-medium transition-colors"
        >
          + Add Category
        </button>
      </div>
    </div>
  );
};
