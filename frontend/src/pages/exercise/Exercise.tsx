import { ExerciseList } from "components/exercise/ExerciseList";
import { exerciseModalStore } from "app/store/exercise/useExerciseStore";
import { ExerciseFormModal } from "components/exercise/ExerciseFormModal";

export default function Exercise() {
  const isModalOpen = exerciseModalStore((state) => state.isOpen);

  return (
    <div className="page-container">
      <div className="page-content-box">
        <ExerciseList />
        {isModalOpen && <ExerciseFormModal />}
      </div>
    </div>
  );
}
