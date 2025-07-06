import type { Exercise } from "types/tableType";
import { exerciseModalStore } from "app/store/exercise/useExerciseStore";
type ExerciseItemProps = {
  exercise: Exercise;
};

export const ExerciseItem = ({ exercise }: ExerciseItemProps) => {
  const openModal = exerciseModalStore((state) => state.openModal);
  return (
    <div className="flex flex-row items-center justify-between gap-2 p-4 border-b-1 border-primary-button last:border-b-0">
      <h3>{exercise.name}</h3>
      <div className=" ">
        <button
          onClick={() => openModal(exercise)}
          className="bg-primary-bg hover:bg-secondary focus:outline-2 focus:bg-secondary text-white px-4 py-2 rounded-3xl"
        >
          Edit
        </button>
      </div>
    </div>
  );
};
