import { type ClientExercise, StateEnum } from "types/tableType";
import { create } from "zustand";

 

interface ClientExerciseListState {
  clientExercises: ClientExercise[];
  setClientExercises: (data: ClientExercise[]) => void;
  filterState: StateEnum;
  setFilterState: (filterState: StateEnum) => void;
}

export const clientExerciseListStore = create<ClientExerciseListState>(
  (set) => ({
    clientExercises: [],
    setClientExercises: (data) => set({ clientExercises: data }),
    filterState: StateEnum.ALL,
    setFilterState: (filterState) => set({ filterState }),
  }),
);
