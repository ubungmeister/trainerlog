import { type ClientExercise, type Exercise } from "types/tableType";
import { create } from "zustand";

interface ClientExerciseState {
  isOpen: boolean;
  clientExercise: ClientExercise | null;
  exercises: Exercise[] | null;
  openModal: (params: {
    clientExercise: ClientExercise | null;
    exercises: Exercise[];
  }) => void;
  closeModal: () => void;
}

export const clientExerciseStore = create<ClientExerciseState>((set) => ({
  isOpen: false,
  clientExercise: null,
  exercises: null,
  openModal: ({ clientExercise, exercises }) =>
    set(() => ({
      isOpen: true,
      clientExercise,
      exercises,
    })),
  closeModal: () =>
    set({
      isOpen: false,
      clientExercise: null,
      exercises: null,
    }),
}));
