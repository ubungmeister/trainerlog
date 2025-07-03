import { categoryModalStore } from "app/store/category/useCategoryStore";
import { CategoryFormModal } from "components/category/CategoryFormModal";
import { CategoryList } from "components/category/CategoryList";

export const Category = () => {
  const isModalOpen = categoryModalStore((state) => state.isOpen);

  return (
    <div className="bg-primary-bg p-3 ">
      <div className=" min-h-screen bg-primary-surface rounded-3xl ">
        <CategoryList />
        {isModalOpen && <CategoryFormModal />}
      </div>
    </div>
  );
};
