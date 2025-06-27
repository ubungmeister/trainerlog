import { type ClientExercise } from "types/tableType";
import { create } from "zustand";

type Filter = "all" | "active" | "inactive";

interface ClientExerciseListState {
  clientExercises: ClientExercise[];
  setClientExercises: (data: ClientExercise[]) => void;
  filterState: Filter;
  setFilterState: (filterState: Filter) => void;
}

export const clientExerciseListStore = create<ClientExerciseListState>(
  (set) => ({
    clientExercises: [],
    setClientExercises: (data) => set({ clientExercises: data }),
    filterState: "all",
    setFilterState: (filterState) => set({ filterState }),
  }),
);
