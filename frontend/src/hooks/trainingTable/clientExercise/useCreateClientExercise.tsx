import { useMutation } from "@tanstack/react-query";
import { type ClientExercise } from "types/tableType";

export function useCreateClientExercise() {
  const API_URL = import.meta.env.VITE_API_URL;

  return useMutation({
    mutationFn: async (clientExercise: ClientExercise) => {
      const response = await fetch(`${API_URL}/api/client-exercises/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(clientExercise),
      });

      if (!response.ok) {
        throw new Error("Failed to create client exercise");
      }
      return response.json();
    },
  });
}
