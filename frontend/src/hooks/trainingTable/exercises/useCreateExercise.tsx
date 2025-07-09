import { useMutation } from "@tanstack/react-query";
import { type Exercise } from "types/tableType";

export function useCreateExercise() {
  const API_URL = import.meta.env.VITE_API_URL;

  return useMutation({
    mutationFn: async (exercise: Exercise) => {
      const response = await fetch(`${API_URL}/api/exercises/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(exercise),
      });

      if (!response.ok) {
        throw new Error("Failed to create exercise");
      }
      return response.json();
    },
  });
}
