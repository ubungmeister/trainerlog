import { create } from "zustand";
import type { StateCreator } from "zustand";
import type { Category } from "types/tableType";

interface CategoryModalState {
  isOpen: boolean;
  openModal: (category?: Category) => void;
  closeModal: () => void;
  category?: Category;
  categories: Category[];
  setCategory: (category?: Category) => void;
  setCategories: (categories: Category[]) => void;
}

export const categoryModalStore = create<CategoryModalState>(((set) => ({
  isOpen: false,
  category: undefined,
  categories: [],
  setCategories: (categories) => set({ categories }),
  openModal: (category?: Category) =>
    set(() => ({
      isOpen: true,
      category,
    })),
  closeModal: () => set({ isOpen: false, category: undefined }),
  setCategory: (category) => set({ category }),
})) as StateCreator<CategoryModalState>);
