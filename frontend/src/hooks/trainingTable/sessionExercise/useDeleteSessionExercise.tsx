import { useMutation } from "@tanstack/react-query";
import { type SessionExercise } from "types/tableType";

export function useDeleteSessionExercise() {
  const API_URL = import.meta.env.VITE_API_URL;

  return useMutation({
    mutationFn: async (sessionExercise: SessionExercise) => {
      const response = await fetch(
        `${API_URL}/api/session-exercises/delete/${sessionExercise.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete session exercise");
      }
      return { success: true };
    },
  });
}
