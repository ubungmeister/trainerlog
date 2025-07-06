import { useGetAllExercises } from "hooks/trainingTable/exercises/useGetAllExercises";
import { DataLoading } from "components/ui/DataLoading";
import { exerciseModalStore } from "app/store/exercise/useExerciseStore";
import { useMemo } from "react";
import type { Exercise } from "types/tableType";
import { ExerciseItem } from "./ExerciseItem";
import { StateFilter } from "components/ui/StateFilter";
export const ExerciseList = () => {
  const { data: exercises, isLoading } = useGetAllExercises();

  const openModal = exerciseModalStore((state) => state.openModal);
  const filterState = exerciseModalStore((state) => state.filterState);
  const setFilterState = exerciseModalStore((state) => state.setFilterState);

  const filteredExercises = useMemo(() => {
    if (!exercises) return [];
    return exercises.filter((exercise: Exercise) => {
      if (filterState === "all") return true;
      if (filterState === "active") return exercise.activeExercise;
      if (filterState === "inactive") return !exercise.activeExercise;
      return true;
    });
  }, [exercises, filterState]);

  if (isLoading) {
    return <DataLoading />;
  }

  return (
    <div className="bg-white max-h-min min-w-[80%] md:min-w-[400px] p-4 rounded-3xl  ">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center justify-between mt-2 px-2">
          <h2 className="text-3xl font-bold text-primary-text mb-3">
            Exercises
          </h2>
          <button
            onClick={() => openModal()}
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
        <div className="border-2 border-primary-button rounded-3xl">
          {filteredExercises.map((exercise: Exercise) => (
            <ExerciseItem key={exercise.id} exercise={exercise} />
          ))}
        </div>
      </div>
    </div>
  );
};
