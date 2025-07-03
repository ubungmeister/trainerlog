import {
  type Category,
  type ClientExercise,
  type Exercise,
} from "types/tableType";
import { create } from "zustand";

interface ClientExerciseState {
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
}

export const clientExerciseStore = create<ClientExerciseState>((set) => ({
  isOpen: false,
  clientExercise: null,
  exercises: null,
  categories: null,
  category: null,

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
}));
