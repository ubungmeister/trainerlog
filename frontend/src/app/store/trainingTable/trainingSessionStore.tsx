import { type Session } from 'types/tableType';
import { create } from "zustand";
interface TrainingSessionStore {
  isOpen: boolean;
  session: Session | null;
  openModal: (params: { session: Session }) => void;
  closeModal: () => void;
}

export const trainingSessionStore = create<TrainingSessionStore>((set) => ({
  isOpen: false,
  session: null,
  openModal: ({ session }) =>
    set(() => ({
      isOpen: true,
      session,
    })),
  closeModal: () =>
    set({
      isOpen: false,
      session: null,
    }),
}));