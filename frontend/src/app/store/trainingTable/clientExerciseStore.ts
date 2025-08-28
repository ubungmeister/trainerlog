import {
  type Category,
  type ClientExercise,
  type Exercise,
  StateEnum,
} from "types/tableType";
import { create } from "zustand";

type ClientExerciseState = {
  isOpen: boolean;
  clientExercise: ClientExercise | null;
  exercises: Exercise[] | null;
  categories: Category[] | null;
  category: Category | null;
  openModal: (params: {
    clientExercise: ClientExercise | null;
    exercises: Exercise[];
    categories: Category[] | null;
    category: Category | null;
  }) => void;
  closeModal: () => void;
};

type ClientExerciseListState = {
  clientExercises: ClientExercise[];
  setClientExercises: (data: ClientExercise[]) => void;
  filterState: StateEnum;
  setFilterState: (filterState: StateEnum) => void;
};

export type ClientExerciseCombinedState = ClientExerciseState &
  ClientExerciseListState;

export const clientExerciseStore = create<ClientExerciseCombinedState>(
  (set) => ({
    isOpen: false,
    clientExercise: null,
    exercises: null,
    categories: null,
    category: null,
    clientExercises: [],
    setClientExercises: (data) => set({ clientExercises: data }),
    filterState: StateEnum.ALL,
    setFilterState: (filterState) => set({ filterState }),

    openModal: ({ clientExercise, exercises, categories, category }) =>
      set(() => ({
        isOpen: true,
        clientExercise,
        exercises,
        categories,
        category,
      })),
    closeModal: () =>
      set({
        isOpen: false,
        clientExercise: null,
        exercises: null,
        categories: null,
        category: null,
      }),
  }),
);
