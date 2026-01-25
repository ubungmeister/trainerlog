import { ExerciseCategoryList } from "components/exerciseLibrary/ExerciseCategoryList";
import { exerciseModalStore } from "app/store/exercise/useExerciseStore";
import { ExerciseFormModal } from "components/exercise/ExerciseFormModal";
import { categoryModalStore } from "app/store/category/useCategoryStore";
import { CategoryFormModal } from "components/category/CategoryFormModal";

export default function Exercise() {
  const isExerciseModalOpen = exerciseModalStore((state) => state.isOpen);
  const isCategoryModalOpen = categoryModalStore((state) => state.isOpen);

  return (
    <div className="page-container">
      <div className="page-content-box">
        <ExerciseCategoryList />
        {isExerciseModalOpen && <ExerciseFormModal />}
        {isCategoryModalOpen && <CategoryFormModal />}
      </div>
    </div>
  );
}
