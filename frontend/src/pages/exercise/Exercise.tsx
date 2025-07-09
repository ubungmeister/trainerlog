import { ExerciseList } from "components/exercise/ExerciseList";
import { exerciseModalStore } from "app/store/exercise/useExerciseStore";
import { ExerciseFormModal } from "components/exercise/ExerciseFormModal";

export const Exercise = () => {
  const isModalOpen = exerciseModalStore((state) => state.isOpen);

  return (
    <div className="bg-primary-bg p-3 ">
      <div className=" min-h-screen bg-primary-surface rounded-3xl ">
        <ExerciseList />
        {isModalOpen && <ExerciseFormModal />}
      </div>
    </div>
  );
};
