import { categoryModalStore } from "app/store/category/useCategoryStore";
import { CategoryFormModal } from "components/category/CategoryFormModal";
import { CategoryList } from "components/category/CategoryList";

export default function Category() {
  const isModalOpen = categoryModalStore((state) => state.isOpen);

  return (
    <div className="page-container ">
      <div className="page-content-box">
        <CategoryList />
        {isModalOpen && <CategoryFormModal />}
      </div>
    </div>
  );
}
