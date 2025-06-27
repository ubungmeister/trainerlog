import { create } from "zustand";

interface SettingsTableState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const settingsTableStore = create<SettingsTableState>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));
