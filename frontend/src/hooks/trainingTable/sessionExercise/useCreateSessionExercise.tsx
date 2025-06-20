import { useMutation } from "@tanstack/react-query";
import { type SessionExercise } from "types/tableType";

export function useCreateSessionExercise() {
  const API_URL = import.meta.env.VITE_API_URL;

  return useMutation({
    mutationFn: async (sessionExercise: SessionExercise) => {
      const response = await fetch(`${API_URL}/api/session-exercises/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(sessionExercise),
      });

      if (!response.ok) {
        throw new Error("Failed to create session exercise");
      }
      return response.json();
    },
  });
}
