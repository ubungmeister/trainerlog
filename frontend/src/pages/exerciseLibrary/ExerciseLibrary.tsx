import { ExerciseCategoryList } from "components/exerciseLibrary";
import { exerciseModalStore } from "app/store/exercise";
import { ExerciseFormModal } from "components/exercise";
import { categoryModalStore } from "app/store/category";
import { CategoryFormModal } from "components/category";

export default function ExerciseLibrary() {
  const isExerciseModalOpen = exerciseModalStore((state) => state.isOpen);
  const isCategoryModalOpen = categoryModalStore((state) => state.isOpen);

  return (
    <div className="page-content-box">
      <ExerciseCategoryList />
      {isExerciseModalOpen && <ExerciseFormModal />}
      {isCategoryModalOpen && <CategoryFormModal />}
    </div>
  );
}
