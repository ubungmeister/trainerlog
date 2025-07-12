import { type Category, type Exercise, StateEnum } from "types/tableType";
import { create } from "zustand";
import type { StateCreator } from "zustand";

interface ExerciseModalState {
  isOpen: boolean;
  openModal: (exercise?: Exercise) => void;
  closeModal: () => void;
  exercise?: Exercise;
  exercises: Exercise[];
  categories: Category[];
  filterState: StateEnum;
  setExercise: (exercise?: Exercise) => void;
  setExercises: (exercises: Exercise[]) => void;
  setCategories: (categories: Category[]) => void;
  setFilterState: (filterState: StateEnum) => void;
}

export const exerciseModalStore = create<ExerciseModalState>(((set) => ({
  isOpen: false,
  exercise: undefined,
  exercises: [],
  categories: [],
  filterState: StateEnum.ALL,
  setExercises: (exercises) => set({ exercises }),
  openModal: (exercise?: Exercise) =>
    set(() => ({
      isOpen: true,
      exercise,
    })),
  closeModal: () => set({ isOpen: false, exercise: undefined }),
  setExercise: (exercise) => set({ exercise }),
  setFilterState: (filterState) => set({ filterState }),
  setCategories: (categories) => set({ categories }),
})) as StateCreator<ExerciseModalState>);
