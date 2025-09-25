import { categoryModalStore } from "app/store/category/useCategoryStore";
import { type Category } from "types/tableType";

type CategoryItemProps = {
  category: Category;
};

export const CategoryItem = ({ category }: CategoryItemProps) => {
  const openModal = categoryModalStore((state) => state.openModal);

  return (
    <div className="flex flex-row items-center justify-between gap-2 p-4 border-b-1 border-primary-button last:border-b-0">
      <h3>{category.name}</h3>
      <div className=" ">
        <button
          onClick={() => openModal(category)}
          className="bg-primary-bg hover:bg-secondary focus:outline-2 focus:bg-secondary text-white px-4 py-2 rounded-3xl"
        >
          Edit
        </button>
      </div>
    </div>
  );
};
