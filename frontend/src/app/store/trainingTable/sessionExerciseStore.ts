import {
  type Exercise,
  type Session,
  type SessionExercise,
} from "types/tableType";
import { create } from "zustand";

interface SessionExerciseState {
  isOpen: boolean;
  session: Session | null;
  exercise: Exercise | null;
  sessionExercise: SessionExercise | null;
  openModal: (params: {
    session: Session;
    exercise: Exercise;
    sessionExercise?: SessionExercise;
  }) => void;
  closeModal: () => void;
}

export const sessionExerciseStore = create<SessionExerciseState>((set) => ({
  isOpen: false,
  session: null,
  exercise: null,
  sessionExercise: null,
  openModal: ({ session, exercise, sessionExercise }) =>
    set(() => ({
      isOpen: true,
      session,
      exercise,
      sessionExercise: sessionExercise ?? null,
    })),
  closeModal: () =>
    set({
      isOpen: false,
      session: null,
      exercise: null,
      sessionExercise: null,
    }),
}));
