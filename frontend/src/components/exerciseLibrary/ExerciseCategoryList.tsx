import { useGetAllExercises } from "hooks/trainingTable/exercises/useGetAllExercises";
import { DataLoading } from "components/ui/DataLoading";
import { exerciseModalStore } from "app/store/exercise/useExerciseStore";
import { useEffect, useMemo } from "react";
import type { Category, Exercise } from "types/tableType";
import { StateFilter } from "components/ui/StateFilter";
import { useGetAllCategories } from "hooks/trainingTable/category/useGetAllCategories";
import { categoryModalStore } from "app/store/category/useCategoryStore";
import { groupExercisesByCategory } from "utils/groupExercisesByCategory";
import { CategorySection } from "../category/CategorySection";

export const ExerciseCategoryList = () => {
  const { data: categories, isLoading: isCategoryLoading } =
    useGetAllCategories();
  const { data: exercises, isLoading: isExerciseLoading } =
    useGetAllExercises();

  const openCategoryModal = categoryModalStore((state) => state.openModal);
  const setCategoriesForCategoryModal = categoryModalStore(
    (state) => state.setCategories,
  );
  const openExerciseModal = exerciseModalStore((state) => state.openModal);
  const filterState = exerciseModalStore((state) => state.filterState);
  const setFilterState = exerciseModalStore((state) => state.setFilterState);
  const setExercises = exerciseModalStore((state) => state.setExercises);
  const setCategoriesForExerciseModal = exerciseModalStore(
    (state) => state.setCategories,
  );

  useEffect(() => {
    if (categories) {
      setCategoriesForCategoryModal(categories);
      setCategoriesForExerciseModal(categories);
    }
  }, [
    categories,
    setCategoriesForCategoryModal,
    setCategoriesForExerciseModal,
  ]);

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
    <div className="bg-white max-h-min min-w-[80%] md:min-w-[400px] p-4 rounded-3xl">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center justify-between mt-2 px-2">
          <h2 className="text-3xl font-bold text-primary-text mb-3">
            Exercises Library
          </h2>
          <button
            onClick={() => openExerciseModal()}
            className="bg-primary-bg hover:bg-secondary focus:outline-2 focus:bg-secondary text-white px-4 py-2 rounded-3xl"
          >
            Add Exercise
          </button>
        </div>
        <div className="px-2 flex flex-row justify-start mb-2">
          <StateFilter
            filterState={filterState}
            setFilterState={setFilterState}
          />
        </div>
        <div className="border-2 border-primary-button rounded-3xl overflow-hidden">
          {groupedExercises.length > 0 ? (
            groupedExercises.map((group) => (
              <CategorySection
                key={group.categoryId ?? "uncategorized"}
                group={group}
                onEditCategory={handleEditCategory}
              />
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No exercises found
            </div>
          )}
        </div>
        <div className="px-2">
          <button
            onClick={() => openCategoryModal()}
            className="text-primary-bg hover:text-secondary font-medium"
          >
            + Add Category
          </button>
        </div>
      </div>
    </div>
  );
};
