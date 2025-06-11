import { create } from "zustand";
import type { StateCreator } from "zustand";

interface UserModalState {
  isOpen: boolean;
  openModal: (user?: UserType) => void;
  closeModal: () => void;
  user?: UserType;
  setUser: (user?: UserType) => void;
}

type UserType = {
  fullName: string;
  email: string;
  id: string;
};

export const userModalStore = create<UserModalState>(((set) => ({
  isOpen: false,
  user: undefined,
  openModal: (user?: UserType) =>
    set(() => ({
      isOpen: true,
      user,
    })),
  closeModal: () => set({ isOpen: false, user: undefined }),
  setUser: (user) => set({ user }),
})) as StateCreator<UserModalState>);
