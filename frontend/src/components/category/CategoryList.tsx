import { useGetAllCategories } from "hooks/trainingTable/category/useGetAllCategories";
import type { Category } from "types/tableType";
import { CategoryItem } from "./CategoryItem";
import { categoryModalStore } from "app/store/category/useCategoryStore";
import { useEffect } from "react";

export const CategoryList = () => {
  const { data: categories, isLoading } = useGetAllCategories();

  const openModal = categoryModalStore((state) => state.openModal);
  const setCategories = categoryModalStore((state) => state.setCategories);

  // Set the categories in the store when the component mounts
  useEffect(() => {
    console.log("categories here", categories);
    if (categories) {
      setCategories(categories);
    }
  }, [categories]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-white max-h-min min-w-[80%] md:min-w-[400px] p-4 rounded-3xl  ">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center justify-between mt-2 px-2">
          <h2 className="text-3xl font-bold text-primaty-text mb-3">
            Categories
          </h2>
          <button
            onClick={() => openModal()}
            className="bg-primary-bg hover:bg-secondary focus:outline-2 focus:bg-secondary text-white px-4 py-2 rounded-3xl"
          >
            Add Category
          </button>
        </div>
        <div className="border-2 border-primary-button rounded-3xl">
          {categories.map((category: Category) => (
            <CategoryItem key={category.id} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
};
