import { create } from "zustand";

interface TableStoreState {
  clientId: string;
  setClientId: (clientId: string) => void;
}

export const tableStore = create<TableStoreState>((set) => ({
  clientId: "",
  setClientId: (clientId: string) => set({ clientId }),
}));
